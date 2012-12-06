//==============================================================================
// ■ Window_Message
//------------------------------------------------------------------------------
// 　文章表示に使うメッセージウィンドウです。
//==============================================================================

class Window_Message < Window_Base
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize
    super(0, 0, window_width, window_height)
    self.z = 200
    self.openness = 0
    create_all_windows
    create_back_bitmap
    create_back_sprite
    clear_instance_variables
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ幅の取得
  //--------------------------------------------------------------------------
  public window_width
    Graphics.width
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ高さの取得
  //--------------------------------------------------------------------------
  public window_height
    fitting_height(visible_line_number)
  }
  //--------------------------------------------------------------------------
  // ● インスタンス変数のクリア
  //--------------------------------------------------------------------------
  public clear_instance_variables
    @fiber = nil                // ファイバー
    @background = 0             // 背景タイプ
    @position = 2               // 表示位置
    clear_flags
  }
  //--------------------------------------------------------------------------
  // ● フラグのクリア
  //--------------------------------------------------------------------------
  public clear_flags
    @show_fast = false          // 早送りフラグ
    @line_show_fast = false     // 行単位早送りフラグ
    @pause_skip = false         // 入力待ち省略フラグ
  }
  //--------------------------------------------------------------------------
  // ● 表示行数の取得
  //--------------------------------------------------------------------------
  public visible_line_number
    return 4
  }
  //--------------------------------------------------------------------------
  // ● 解放
  //--------------------------------------------------------------------------
  public dispose
    super
    dispose_all_windows
    dispose_back_bitmap
    dispose_back_sprite
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    super
    update_all_windows
    update_back_sprite
    update_fiber
  }
  //--------------------------------------------------------------------------
  // ● ファイバーの更新
  //--------------------------------------------------------------------------
  public update_fiber
    if @fiber
      @fiber.resume
    elsif $game_message.busy? && !$game_message.scroll_mode
      @fiber = Fiber.new { fiber_main }
      @fiber.resume
    else
      $game_message.visible = false
    }
  }
  //--------------------------------------------------------------------------
  // ● 全ウィンドウの作成
  //--------------------------------------------------------------------------
  public create_all_windows
    @gold_window = Window_Gold.new
    @gold_window.x = Graphics.width - @gold_window.width
    @gold_window.y = 0
    @gold_window.openness = 0
    @choice_window = Window_ChoiceList.new(self)
    @number_window = Window_NumberInput.new(self)
    @item_window = Window_KeyItem.new(self)
  }
  //--------------------------------------------------------------------------
  // ● 背景ビットマップの作成
  //--------------------------------------------------------------------------
  public create_back_bitmap
    @back_bitmap = Bitmap.new(width, height)
    rect1 = Rect.new(0, 0, width, 12)
    rect2 = Rect.new(0, 12, width, height - 24)
    rect3 = Rect.new(0, height - 12, width, 12)
    @back_bitmap.gradient_fill_rect(rect1, back_color2, back_color1, true)
    @back_bitmap.fill_rect(rect2, back_color1)
    @back_bitmap.gradient_fill_rect(rect3, back_color1, back_color2, true)
  }
  //--------------------------------------------------------------------------
  // ● 背景色 1 の取得
  //--------------------------------------------------------------------------
  public back_color1
    Color.new(0, 0, 0, 160)
  }
  //--------------------------------------------------------------------------
  // ● 背景色 2 の取得
  //--------------------------------------------------------------------------
  public back_color2
    Color.new(0, 0, 0, 0)
  }
  //--------------------------------------------------------------------------
  // ● 背景スプライトの作成
  //--------------------------------------------------------------------------
  public create_back_sprite
    @back_sprite = Sprite.new
    @back_sprite.bitmap = @back_bitmap
    @back_sprite.visible = false
    @back_sprite.z = z - 1
  }
  //--------------------------------------------------------------------------
  // ● 全ウィンドウの解放
  //--------------------------------------------------------------------------
  public dispose_all_windows
    @gold_window.dispose
    @choice_window.dispose
    @number_window.dispose
    @item_window.dispose
  }
  //--------------------------------------------------------------------------
  // ● 背景ビットマップの解放
  //--------------------------------------------------------------------------
  public dispose_back_bitmap
    @back_bitmap.dispose
  }
  //--------------------------------------------------------------------------
  // ● 背景スプライトの解放
  //--------------------------------------------------------------------------
  public dispose_back_sprite
    @back_sprite.dispose
  }
  //--------------------------------------------------------------------------
  // ● 全ウィンドウの更新
  //--------------------------------------------------------------------------
  public update_all_windows
    @gold_window.update
    @choice_window.update
    @number_window.update
    @item_window.update
  }
  //--------------------------------------------------------------------------
  // ● 背景スプライトの更新
  //--------------------------------------------------------------------------
  public update_back_sprite
    @back_sprite.visible = (@background == 1)
    @back_sprite.y = y
    @back_sprite.opacity = openness
    @back_sprite.update
  }
  //--------------------------------------------------------------------------
  // ● ファイバーのメイン処理
  //--------------------------------------------------------------------------
  public fiber_main
    $game_message.visible = true
    update_background
    update_placement
    loop do
      process_all_text if $game_message.has_text?
      process_input
      $game_message.clear
      @gold_window.close
      Fiber.yield
      break unless text_continue?
    }
    close_and_wait
    $game_message.visible = false
    @fiber = nil
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ背景の更新
  //--------------------------------------------------------------------------
  public update_background
    @background = $game_message.background
    self.opacity = @background == 0 ? 255 : 0
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ位置の更新
  //--------------------------------------------------------------------------
  public update_placement
    @position = $game_message.position
    self.y = @position * (Graphics.height - height) / 2
    @gold_window.y = y > 0 ? 0 : Graphics.height - @gold_window.height
  }
  //--------------------------------------------------------------------------
  // ● 全テキストの処理
  //--------------------------------------------------------------------------
  public process_all_text
    open_and_wait
    text = convert_escape_characters($game_message.all_text)
    pos = {}
    new_page(text, pos)
    process_character(text.slice!(0, 1), text, pos) until text.empty?
  }
  //--------------------------------------------------------------------------
  // ● 入力処理
  //--------------------------------------------------------------------------
  public process_input
    if $game_message.choice?
      input_choice
    elsif $game_message.num_input?
      input_number
    elsif $game_message.item_choice?
      input_item
    else
      input_pause unless @pause_skip
    }
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウを開き、完全に開くまで待つ
  //--------------------------------------------------------------------------
  public open_and_wait
    open
    Fiber.yield until open?
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウを閉じ、完全に閉じるまで待つ
  //--------------------------------------------------------------------------
  public close_and_wait
    close
    Fiber.yield until all_close?
  }
  //--------------------------------------------------------------------------
  // ● 全ウィンドウが完全に閉じているか判定
  //--------------------------------------------------------------------------
  public all_close?
    close? && @choice_window.close? &&
    @number_window.close? && @item_window.close?
  }
  //--------------------------------------------------------------------------
  // ● 文章を続けて表示するか判定
  //--------------------------------------------------------------------------
  public text_continue?
    $game_message.has_text? && !settings_changed?
  }
  //--------------------------------------------------------------------------
  // ● 背景と位置の変更判定
  //--------------------------------------------------------------------------
  public settings_changed?
    @background != $game_message.background ||
    @position != $game_message.position
  }
  //--------------------------------------------------------------------------
  // ● ウェイト
  //--------------------------------------------------------------------------
  public wait(duration)
    duration.times { Fiber.yield }
  }
  //--------------------------------------------------------------------------
  // ● 早送りフラグの更新
  //--------------------------------------------------------------------------
  public update_show_fast
    @show_fast = true if Input.trigger?(:C)
  }
  //--------------------------------------------------------------------------
  // ● 一文字出力後のウェイト
  //--------------------------------------------------------------------------
  public wait_for_one_character
    update_show_fast
    Fiber.yield unless @show_fast || @line_show_fast
  }
  //--------------------------------------------------------------------------
  // ● 改ページ処理
  //--------------------------------------------------------------------------
  public new_page(text, pos)
    contents.clear
    draw_face($game_message.face_name, $game_message.face_index, 0, 0)
    reset_font_settings
    pos[:x] = new_line_x
    pos[:y] = 0
    pos[:new_x] = new_line_x
    pos[:height] = calc_line_height(text)
    clear_flags
  }
  //--------------------------------------------------------------------------
  // ● 改行位置の取得
  //--------------------------------------------------------------------------
  public new_line_x
    $game_message.face_name.empty? ? 0 : 112
  }
  //--------------------------------------------------------------------------
  // ● 通常文字の処理
  //--------------------------------------------------------------------------
  public process_normal_character(c, pos)
    super
    wait_for_one_character
  }
  //--------------------------------------------------------------------------
  // ● 改行文字の処理
  //--------------------------------------------------------------------------
  public process_new_line(text, pos)
    @line_show_fast = false
    super
    if need_new_page?(text, pos)
      input_pause
      new_page(text, pos)
    }
  }
  //--------------------------------------------------------------------------
  // ● 改ページが必要か判定
  //--------------------------------------------------------------------------
  public need_new_page?(text, pos)
    pos[:y] + pos[:height] > contents.height && !text.empty?
  }
  //--------------------------------------------------------------------------
  // ● 改ページ文字の処理
  //--------------------------------------------------------------------------
  public process_new_page(text, pos)
    text.slice!(/^\n/)
    input_pause
    new_page(text, pos)
  }
  //--------------------------------------------------------------------------
  // ● 制御文字によるアイコン描画の処理
  //--------------------------------------------------------------------------
  public process_draw_icon(icon_index, pos)
    super
    wait_for_one_character
  }
  //--------------------------------------------------------------------------
  // ● 制御文字の処理
  //     code : 制御文字の本体部分（「\C[1]」なら「C」）
  //     text : 描画処理中の文字列バッファ（必要なら破壊的に変更）
  //     pos  : 描画位置 {:x, :y, :new_x, :height}
  //--------------------------------------------------------------------------
  public process_escape_character(code, text, pos)
    case code.upcase
    when '$'
      @gold_window.open
    when '.'
      wait(15)
    when '|'
      wait(60)
    when '!'
      input_pause
    when '>'
      @line_show_fast = true
    when '<'
      @line_show_fast = false
    when '^'
      @pause_skip = true
    else
      super
    }
  }
  //--------------------------------------------------------------------------
  // ● 入力待ち処理
  //--------------------------------------------------------------------------
  public input_pause
    self.pause = true
    wait(10)
    Fiber.yield until Input.trigger?(:B) || Input.trigger?(:C)
    Input.update
    self.pause = false
  }
  //--------------------------------------------------------------------------
  // ● 選択肢の入力処理
  //--------------------------------------------------------------------------
  public input_choice
    @choice_window.start
    Fiber.yield while @choice_window.active
  }
  //--------------------------------------------------------------------------
  // ● 数値の入力処理
  //--------------------------------------------------------------------------
  public input_number
    @number_window.start
    Fiber.yield while @number_window.active
  }
  //--------------------------------------------------------------------------
  // ● アイテムの選択処理
  //--------------------------------------------------------------------------
  public input_item
    @item_window.start
    Fiber.yield while @item_window.active
  }
}
