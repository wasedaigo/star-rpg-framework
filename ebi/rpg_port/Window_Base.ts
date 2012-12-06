//==============================================================================
// ■ Window_Base
//------------------------------------------------------------------------------
// 　ゲーム中の全てのウィンドウのスーパークラスです。
//==============================================================================

class Window_Base < Window
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize(x, y, width, height)
    super
    self.windowskin = Cache.system("Window")
    update_padding
    update_tone
    create_contents
    @opening = @closing = false
  }
  //--------------------------------------------------------------------------
  // ● 解放
  //--------------------------------------------------------------------------
  public dispose
    contents.dispose unless disposed?
    super
  }
  //--------------------------------------------------------------------------
  // ● 行の高さを取得
  //--------------------------------------------------------------------------
  public line_height
    return 24
  }
  //--------------------------------------------------------------------------
  // ● 標準パディングサイズの取得
  //--------------------------------------------------------------------------
  public standard_padding
    return 12
  }
  //--------------------------------------------------------------------------
  // ● パディングの更新
  //--------------------------------------------------------------------------
  public update_padding
    self.padding = standard_padding
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ内容の幅を計算
  //--------------------------------------------------------------------------
  public contents_width
    width - standard_padding * 2
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ内容の高さを計算
  //--------------------------------------------------------------------------
  public contents_height
    height - standard_padding * 2
  }
  //--------------------------------------------------------------------------
  // ● 指定行数に適合するウィンドウの高さを計算
  //--------------------------------------------------------------------------
  public fitting_height(line_number)
    line_number * line_height + standard_padding * 2
  }
  //--------------------------------------------------------------------------
  // ● 色調の更新
  //--------------------------------------------------------------------------
  public update_tone
    self.tone.set($game_system.window_tone)
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウ内容の作成
  //--------------------------------------------------------------------------
  public create_contents
    contents.dispose
    if contents_width > 0 && contents_height > 0
      self.contents = Bitmap.new(contents_width, contents_height)
    else
      self.contents = Bitmap.new(1, 1)
    }
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    super
    update_tone
    update_open if @opening
    update_close if @closing
  }
  //--------------------------------------------------------------------------
  // ● 開く処理の更新
  //--------------------------------------------------------------------------
  public update_open
    self.openness += 48
    @opening = false if open?
  }
  //--------------------------------------------------------------------------
  // ● 閉じる処理の更新
  //--------------------------------------------------------------------------
  public update_close
    self.openness -= 48
    @closing = false if close?
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウを開く
  //--------------------------------------------------------------------------
  public open
    @opening = true unless open?
    @closing = false
    self
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウを閉じる
  //--------------------------------------------------------------------------
  public close
    @closing = true unless close?
    @opening = false
    self
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウの表示
  //--------------------------------------------------------------------------
  public show
    self.visible = true
    self
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウの非表示
  //--------------------------------------------------------------------------
  public hide
    self.visible = false
    self
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウのアクティブ化
  //--------------------------------------------------------------------------
  public activate
    self.active = true
    self
  }
  //--------------------------------------------------------------------------
  // ● ウィンドウの非アクティブ化
  //--------------------------------------------------------------------------
  public deactivate
    self.active = false
    self
  }
  //--------------------------------------------------------------------------
  // ● 文字色取得
  //     n : 文字色番号（0..31）
  //--------------------------------------------------------------------------
  public text_color(n)
    windowskin.get_pixel(64 + (n % 8) * 8, 96 + (n / 8) * 8)
  }
  //--------------------------------------------------------------------------
  // ● 各種文字色の取得
  //--------------------------------------------------------------------------
  public normal_color;      text_color(0);   };    // 通常
  public system_color;      text_color(16);  };    // システム
  public crisis_color;      text_color(17);  };    // ピンチ
  public knockout_color;    text_color(18);  };    // 戦闘不能
  public gauge_back_color;  text_color(19);  };    // ゲージ背景
  public hp_gauge_color1;   text_color(20);  };    // HP ゲージ 1
  public hp_gauge_color2;   text_color(21);  };    // HP ゲージ 2
  public mp_gauge_color1;   text_color(22);  };    // MP ゲージ 1
  public mp_gauge_color2;   text_color(23);  };    // MP ゲージ 2
  public mp_cost_color;     text_color(23);  };    // 消費 TP
  public power_up_color;    text_color(24);  };    // 装備 パワーアップ
  public power_down_color;  text_color(25);  };    // 装備 パワーダウン
  public tp_gauge_color1;   text_color(28);  };    // TP ゲージ 1
  public tp_gauge_color2;   text_color(29);  };    // TP ゲージ 2
  public tp_cost_color;     text_color(29);  };    // 消費 TP
  //--------------------------------------------------------------------------
  // ● 保留項目の背景色を取得
  //--------------------------------------------------------------------------
  public pending_color
    windowskin.get_pixel(80, 80)
  }
  //--------------------------------------------------------------------------
  // ● 半透明描画用のアルファ値を取得
  //--------------------------------------------------------------------------
  public translucent_alpha
    return 160
  }
  //--------------------------------------------------------------------------
  // ● テキスト描画色の変更
  //     enabled : 有効フラグ。false のとき半透明で描画
  //--------------------------------------------------------------------------
  public change_color(color, enabled = true)
    contents.font.color.set(color)
    contents.font.color.alpha = translucent_alpha unless enabled
  }
  //--------------------------------------------------------------------------
  // ● テキストの描画
  //     args : Bitmap//draw_text と同じ
  //--------------------------------------------------------------------------
  public draw_text(*args)
    contents.draw_text(*args)
  }
  //--------------------------------------------------------------------------
  // ● テキストサイズの取得
  //--------------------------------------------------------------------------
  public text_size(str)
    contents.text_size(str)
  }
  //--------------------------------------------------------------------------
  // ● 制御文字つきテキストの描画
  //--------------------------------------------------------------------------
  public draw_text_ex(x, y, text)
    reset_font_settings
    text = convert_escape_characters(text)
    pos = {:x => x, :y => y, :new_x => x, :height => calc_line_height(text)}
    process_character(text.slice!(0, 1), text, pos) until text.empty?
  }
  //--------------------------------------------------------------------------
  // ● フォント設定のリセット
  //--------------------------------------------------------------------------
  public reset_font_settings
    change_color(normal_color)
    contents.font.size = Font.default_size
    contents.font.bold = false
    contents.font.italic = false
  }
  //--------------------------------------------------------------------------
  // ● 制御文字の事前変換
  //    実際の描画を始める前に、原則として文字列に変わるものだけを置き換える。
  //    文字「\」はエスケープ文字（\e）に変換。
  //--------------------------------------------------------------------------
  public convert_escape_characters(text)
    result = text.to_s.clone
    result.gsub!(/\\/)            { "\e" }
    result.gsub!(/\e\e/)          { "\\" }
    result.gsub!(/\eV\[(\d+)\]/i) { $game_variables[$1.to_i] }
    result.gsub!(/\eV\[(\d+)\]/i) { $game_variables[$1.to_i] }
    result.gsub!(/\eN\[(\d+)\]/i) { actor_name($1.to_i) }
    result.gsub!(/\eP\[(\d+)\]/i) { party_member_name($1.to_i) }
    result.gsub!(/\eG/i)          { Vocab::currency_unit }
    result
  }
  //--------------------------------------------------------------------------
  // ● アクター n 番の名前を取得
  //--------------------------------------------------------------------------
  public actor_name(n)
    actor = n >= 1 ? $game_actors[n] : nil
    actor ? actor.name : ""
  }
  //--------------------------------------------------------------------------
  // ● パーティメンバー n 番の名前を取得
  //--------------------------------------------------------------------------
  public party_member_name(n)
    actor = n >= 1 ? $game_party.members[n - 1] : nil
    actor ? actor.name : ""
  }
  //--------------------------------------------------------------------------
  // ● 文字の処理
  //     c    : 文字
  //     text : 描画処理中の文字列バッファ（必要なら破壊的に変更）
  //     pos  : 描画位置 {:x, :y, :new_x, :height}
  //--------------------------------------------------------------------------
  public process_character(c, text, pos)
    case c
    when "\n"   // 改行
      process_new_line(text, pos)
    when "\f"   // 改ページ
      process_new_page(text, pos)
    when "\e"   // 制御文字
      process_escape_character(obtain_escape_code(text), text, pos)
    else        // 普通の文字
      process_normal_character(c, pos)
    }
  }
  //--------------------------------------------------------------------------
  // ● 通常文字の処理
  //--------------------------------------------------------------------------
  public process_normal_character(c, pos)
    text_width = text_size(c).width
    draw_text(pos[:x], pos[:y], text_width * 2, pos[:height], c)
    pos[:x] += text_width
  }
  //--------------------------------------------------------------------------
  // ● 改行文字の処理
  //--------------------------------------------------------------------------
  public process_new_line(text, pos)
    pos[:x] = pos[:new_x]
    pos[:y] += pos[:height]
    pos[:height] = calc_line_height(text)
  }
  //--------------------------------------------------------------------------
  // ● 改ページ文字の処理
  //--------------------------------------------------------------------------
  public process_new_page(text, pos)
  }
  //--------------------------------------------------------------------------
  // ● 制御文字の本体を破壊的に取得
  //--------------------------------------------------------------------------
  public obtain_escape_code(text)
    text.slice!(/^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i)
  }
  //--------------------------------------------------------------------------
  // ● 制御文字の引数を破壊的に取得
  //--------------------------------------------------------------------------
  public obtain_escape_param(text)
    text.slice!(/^\[\d+\]/)[/\d+/].to_i rescue 0
  }
  //--------------------------------------------------------------------------
  // ● 制御文字の処理
  //     code : 制御文字の本体部分（「\C[1]」なら「C」）
  //--------------------------------------------------------------------------
  public process_escape_character(code, text, pos)
    case code.upcase
    when 'C'
      change_color(text_color(obtain_escape_param(text)))
    when 'I'
      process_draw_icon(obtain_escape_param(text), pos)
    when '{'
      make_font_bigger
    when '}'
      make_font_smaller
    }
  }
  //--------------------------------------------------------------------------
  // ● 制御文字によるアイコン描画の処理
  //--------------------------------------------------------------------------
  public process_draw_icon(icon_index, pos)
    draw_icon(icon_index, pos[:x], pos[:y])
    pos[:x] += 24
  }
  //--------------------------------------------------------------------------
  // ● フォントを大きくする
  //--------------------------------------------------------------------------
  public make_font_bigger
    contents.font.size += 8 if contents.font.size <= 64
  }
  //--------------------------------------------------------------------------
  // ● フォントを小さくする
  //--------------------------------------------------------------------------
  public make_font_smaller
    contents.font.size -= 8 if contents.font.size >= 16
  }
  //--------------------------------------------------------------------------
  // ● 行の高さを計算
  //     restore_font_size : 計算後にフォントサイズを元に戻す
  //--------------------------------------------------------------------------
  public calc_line_height(text, restore_font_size = true)
    result = [line_height, contents.font.size].max
    last_font_size = contents.font.size
    text.slice(/^.*$/).scan(/\e[\{\}]/).each do |esc|
      make_font_bigger  if esc == "\e{"
      make_font_smaller if esc == "\e}"
      result = [result, contents.font.size].max
    }
    contents.font.size = last_font_size if restore_font_size
    result
  }
  //--------------------------------------------------------------------------
  // ● ゲージの描画
  //     rate   : 割合（1.0 で満タン）
  //     color1 : グラデーション 左端
  //     color2 : グラデーション 右端
  //--------------------------------------------------------------------------
  public draw_gauge(x, y, width, rate, color1, color2)
    fill_w = (width * rate).to_i
    gauge_y = y + line_height - 8
    contents.fill_rect(x, gauge_y, width, 6, gauge_back_color)
    contents.gradient_fill_rect(x, gauge_y, fill_w, 6, color1, color2)
  }
  //--------------------------------------------------------------------------
  // ● アイコンの描画
  //     enabled : 有効フラグ。false のとき半透明で描画
  //--------------------------------------------------------------------------
  public draw_icon(icon_index, x, y, enabled = true)
    bitmap = Cache.system("Iconset")
    rect = Rect.new(icon_index % 16 * 24, icon_index / 16 * 24, 24, 24)
    contents.blt(x, y, bitmap, rect, enabled ? 255 : translucent_alpha)
  }
  //--------------------------------------------------------------------------
  // ● 顔グラフィックの描画
  //     enabled : 有効フラグ。false のとき半透明で描画
  //--------------------------------------------------------------------------
  public draw_face(face_name, face_index, x, y, enabled = true)
    bitmap = Cache.face(face_name)
    rect = Rect.new(face_index % 4 * 96, face_index / 4 * 96, 96, 96)
    contents.blt(x, y, bitmap, rect, enabled ? 255 : translucent_alpha)
    bitmap.dispose
  }
  //--------------------------------------------------------------------------
  // ● 歩行グラフィックの描画
  //--------------------------------------------------------------------------
  public draw_character(character_name, character_index, x, y)
    return unless character_name
    bitmap = Cache.character(character_name)
    sign = character_name[/^[\!\$]./]
    if sign && sign.include?('$')
      cw = bitmap.width / 3
      ch = bitmap.height / 4
    else
      cw = bitmap.width / 12
      ch = bitmap.height / 8
    }
    n = character_index
    src_rect = Rect.new((n%4*3+1)*cw, (n/4*4)*ch, cw, ch)
    contents.blt(x - cw / 2, y - ch, bitmap, src_rect)
  }
  //--------------------------------------------------------------------------
  // ● HP の文字色を取得
  //--------------------------------------------------------------------------
  public hp_color(actor)
    return knockout_color if actor.hp == 0
    return crisis_color if actor.hp < actor.mhp / 4
    return normal_color
  }
  //--------------------------------------------------------------------------
  // ● MP の文字色を取得
  //--------------------------------------------------------------------------
  public mp_color(actor)
    return crisis_color if actor.mp < actor.mmp / 4
    return normal_color
  }
  //--------------------------------------------------------------------------
  // ● TP の文字色を取得
  //--------------------------------------------------------------------------
  public tp_color(actor)
    return normal_color
  }
  //--------------------------------------------------------------------------
  // ● アクターの歩行グラフィック描画
  //--------------------------------------------------------------------------
  public draw_actor_graphic(actor, x, y)
    draw_character(actor.character_name, actor.character_index, x, y)
  }
  //--------------------------------------------------------------------------
  // ● アクターの顔グラフィック描画
  //--------------------------------------------------------------------------
  public draw_actor_face(actor, x, y, enabled = true)
    draw_face(actor.face_name, actor.face_index, x, y, enabled)
  }
  //--------------------------------------------------------------------------
  // ● 名前の描画
  //--------------------------------------------------------------------------
  public draw_actor_name(actor, x, y, width = 112)
    change_color(hp_color(actor))
    draw_text(x, y, width, line_height, actor.name)
  }
  //--------------------------------------------------------------------------
  // ● 職業の描画
  //--------------------------------------------------------------------------
  public draw_actor_class(actor, x, y, width = 112)
    change_color(normal_color)
    draw_text(x, y, width, line_height, actor.class.name)
  }
  //--------------------------------------------------------------------------
  // ● 二つ名の描画
  //--------------------------------------------------------------------------
  public draw_actor_nickname(actor, x, y, width = 180)
    change_color(normal_color)
    draw_text(x, y, width, line_height, actor.nickname)
  }
  //--------------------------------------------------------------------------
  // ● レベルの描画
  //--------------------------------------------------------------------------
  public draw_actor_level(actor, x, y)
    change_color(system_color)
    draw_text(x, y, 32, line_height, Vocab::level_a)
    change_color(normal_color)
    draw_text(x + 32, y, 24, line_height, actor.level, 2)
  }
  //--------------------------------------------------------------------------
  // ● ステートおよび強化／弱体のアイコンを描画
  //--------------------------------------------------------------------------
  public draw_actor_icons(actor, x, y, width = 96)
    icons = (actor.state_icons + actor.buff_icons)[0, width / 24]
    icons.each_with_index {|n, i| draw_icon(n, x + 24 * i, y) }
  }
  //--------------------------------------------------------------------------
  // ● 現在値／最大値を分数形式で描画
  //     current : 現在値
  //     max     : 最大値
  //     color1  : 現在値の色
  //     color2  : 最大値の色
  //--------------------------------------------------------------------------
  public draw_current_and_max_values(x, y, width, current, max, color1, color2)
    change_color(color1)
    xr = x + width
    if width < 96
      draw_text(xr - 40, y, 42, line_height, current, 2)
    else
      draw_text(xr - 92, y, 42, line_height, current, 2)
      change_color(color2)
      draw_text(xr - 52, y, 12, line_height, "/", 2)
      draw_text(xr - 42, y, 42, line_height, max, 2)
    }
  }
  //--------------------------------------------------------------------------
  // ● HP の描画
  //--------------------------------------------------------------------------
  public draw_actor_hp(actor, x, y, width = 124)
    draw_gauge(x, y, width, actor.hp_rate, hp_gauge_color1, hp_gauge_color2)
    change_color(system_color)
    draw_text(x, y, 30, line_height, Vocab::hp_a)
    draw_current_and_max_values(x, y, width, actor.hp, actor.mhp,
      hp_color(actor), normal_color)
  }
  //--------------------------------------------------------------------------
  // ● MP の描画
  //--------------------------------------------------------------------------
  public draw_actor_mp(actor, x, y, width = 124)
    draw_gauge(x, y, width, actor.mp_rate, mp_gauge_color1, mp_gauge_color2)
    change_color(system_color)
    draw_text(x, y, 30, line_height, Vocab::mp_a)
    draw_current_and_max_values(x, y, width, actor.mp, actor.mmp,
      mp_color(actor), normal_color)
  }
  //--------------------------------------------------------------------------
  // ● TP の描画
  //--------------------------------------------------------------------------
  public draw_actor_tp(actor, x, y, width = 124)
    draw_gauge(x, y, width, actor.tp_rate, tp_gauge_color1, tp_gauge_color2)
    change_color(system_color)
    draw_text(x, y, 30, line_height, Vocab::tp_a)
    change_color(tp_color(actor))
    draw_text(x + width - 42, y, 42, line_height, actor.tp.to_i, 2)
  }
  //--------------------------------------------------------------------------
  // ● シンプルなステータスの描画
  //--------------------------------------------------------------------------
  public draw_actor_simple_status(actor, x, y)
    draw_actor_name(actor, x, y)
    draw_actor_level(actor, x, y + line_height * 1)
    draw_actor_icons(actor, x, y + line_height * 2)
    draw_actor_class(actor, x + 120, y)
    draw_actor_hp(actor, x + 120, y + line_height * 1)
    draw_actor_mp(actor, x + 120, y + line_height * 2)
  }
  //--------------------------------------------------------------------------
  // ● 能力値の描画
  //--------------------------------------------------------------------------
  public draw_actor_param(actor, x, y, param_id)
    change_color(system_color)
    draw_text(x, y, 120, line_height, Vocab::param(param_id))
    change_color(normal_color)
    draw_text(x + 120, y, 36, line_height, actor.param(param_id), 2)
  }
  //--------------------------------------------------------------------------
  // ● アイテム名の描画
  //     enabled : 有効フラグ。false のとき半透明で描画
  //--------------------------------------------------------------------------
  public draw_item_name(item, x, y, enabled = true, width = 172)
    return unless item
    draw_icon(item.icon_index, x, y, enabled)
    change_color(normal_color, enabled)
    draw_text(x + 24, y, width, line_height, item.name)
  }
  //--------------------------------------------------------------------------
  // ● 通貨単位つき数値（所持金など）の描画
  //--------------------------------------------------------------------------
  public draw_currency_value(value, unit, x, y, width)
    cx = text_size(unit).width
    change_color(normal_color)
    draw_text(x, y, width - cx - 2, line_height, value, 2)
    change_color(system_color)
    draw_text(x, y, width, line_height, unit, 2)
  }
  //--------------------------------------------------------------------------
  // ● 能力値変化の描画色取得
  //--------------------------------------------------------------------------
  public param_change_color(change)
    return power_up_color   if change > 0
    return power_down_color if change < 0
    return normal_color
  }
}
