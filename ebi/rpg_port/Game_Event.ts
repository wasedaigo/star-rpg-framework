//==============================================================================
// ■ Game_Event
//------------------------------------------------------------------------------
// 　イベントを扱うクラスです。条件判定によるイベントページ切り替えや、並列処理
// イベント実行などの機能を持っており、Game_Map クラスの内部で使用されます。
//==============================================================================

class Game_Event < Game_Character
  //--------------------------------------------------------------------------
  // ● 公開インスタンス変数
  //--------------------------------------------------------------------------
  attr_reader   :trigger                  // トリガー
  attr_reader   :list                     // 実行内容
  attr_reader   :starting                 // 起動中フラグ
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //     event : RPG::Event
  //--------------------------------------------------------------------------
  public initialize(map_id, event)
    super()
    @map_id = map_id
    @event = event
    @id = @event.id
    moveto(@event.x, @event.y)
    refresh
  }
  //--------------------------------------------------------------------------
  // ● 公開メンバ変数の初期化
  //--------------------------------------------------------------------------
  public init_public_members
    super
    @trigger = 0
    @list = nil
    @starting = false
  }
  //--------------------------------------------------------------------------
  // ● 非公開メンバ変数の初期化
  //--------------------------------------------------------------------------
  public init_private_members
    super
    @move_type = 0                        // 移動タイプ
    @erased = false                       // 一時消去フラグ
    @page = nil                           // イベントページ
  }
  //--------------------------------------------------------------------------
  // ● キャラクターとの衝突判定
  //--------------------------------------------------------------------------
  public collide_with_characters?(x, y)
    super || collide_with_player_characters?(x, y)
  }
  //--------------------------------------------------------------------------
  // ● プレイヤーとの衝突判定（フォロワーを含む）
  //--------------------------------------------------------------------------
  public collide_with_player_characters?(x, y)
    normal_priority? && $game_player.collide?(x, y)
  }
  //--------------------------------------------------------------------------
  // ● ロック（実行中のイベントが立ち止まる処理）
  //--------------------------------------------------------------------------
  public lock
    unless @locked
      @prelock_direction = @direction
      turn_toward_player
      @locked = true
    }
  }
  //--------------------------------------------------------------------------
  // ● ロック解除
  //--------------------------------------------------------------------------
  public unlock
    if @locked
      @locked = false
      set_direction(@prelock_direction)
    }
  }
  //--------------------------------------------------------------------------
  // ● 停止時の更新
  //--------------------------------------------------------------------------
  public update_stop
    super
    update_self_movement unless @move_route_forcing
  }
  //--------------------------------------------------------------------------
  // ● 自律移動の更新
  //--------------------------------------------------------------------------
  public update_self_movement
    if near_the_screen? && @stop_count > stop_count_threshold
      case @move_type
      when 1;  move_type_random
      when 2;  move_type_toward_player
      when 3;  move_type_custom
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● 画面の可視領域付近にいるか判定
  //     dx : 画面中央から左右何マス以内を判定するか
  //     dy : 画面中央から上下何マス以内を判定するか
  //--------------------------------------------------------------------------
  public near_the_screen?(dx = 12, dy = 8)
    ax = $game_map.adjust_x(@real_x) - Graphics.width / 2 / 32
    ay = $game_map.adjust_y(@real_y) - Graphics.height / 2 / 32
    ax >= -dx && ax <= dx && ay >= -dy && ay <= dy
  }
  //--------------------------------------------------------------------------
  // ● 自律移動を開始する停止カウントの閾値を計算
  //--------------------------------------------------------------------------
  public stop_count_threshold
    30 * (5 - @move_frequency)
  }
  //--------------------------------------------------------------------------
  // ● 移動タイプ : ランダム
  //--------------------------------------------------------------------------
  public move_type_random
    case rand(6)
    when 0..1;  move_random
    when 2..4;  move_forward
    when 5;     @stop_count = 0
    }
  }
  //--------------------------------------------------------------------------
  // ● 移動タイプ : 近づく
  //--------------------------------------------------------------------------
  public move_type_toward_player
    if near_the_player?
      case rand(6)
      when 0..3;  move_toward_player
      when 4;     move_random
      when 5;     move_forward
      }
    else
      move_random
    }
  }
  //--------------------------------------------------------------------------
  // ● プレイヤーの近くにいるか判定
  //--------------------------------------------------------------------------
  public near_the_player?
    sx = distance_x_from($game_player.x).abs
    sy = distance_y_from($game_player.y).abs
    sx + sy < 20
  }
  //--------------------------------------------------------------------------
  // ● 移動タイプ : カスタム
  //--------------------------------------------------------------------------
  public move_type_custom
    update_routine_move
  }
  //--------------------------------------------------------------------------
  // ● 起動中フラグのクリア
  //--------------------------------------------------------------------------
  public clear_starting_flag
    @starting = false
  }
  //--------------------------------------------------------------------------
  // ● 実行内容が空か否かを判定
  //--------------------------------------------------------------------------
  public empty?
    !@list || @list.size <= 1
  }
  //--------------------------------------------------------------------------
  // ● 指定されたトリガーのいずれかか否かを判定
  //     triggers : トリガーの配列
  //--------------------------------------------------------------------------
  public trigger_in?(triggers)
    triggers.include?(@trigger)
  }
  //--------------------------------------------------------------------------
  // ● イベント起動
  //--------------------------------------------------------------------------
  public start
    return if empty?
    @starting = true
    lock if trigger_in?([0,1,2])
  }
  //--------------------------------------------------------------------------
  // ● 一時消去
  //--------------------------------------------------------------------------
  public erase
    @erased = true
    refresh
  }
  //--------------------------------------------------------------------------
  // ● リフレッシュ
  //--------------------------------------------------------------------------
  public refresh
    new_page = @erased ? nil : find_proper_page
    setup_page(new_page) if !new_page || new_page != @page
  }
  //--------------------------------------------------------------------------
  // ● 条件に合うイベントページを見つける
  //--------------------------------------------------------------------------
  public find_proper_page
    @event.pages.reverse.find {|page| conditions_met?(page) }
  }
  //--------------------------------------------------------------------------
  // ● イベントページの条件合致判定
  //--------------------------------------------------------------------------
  public conditions_met?(page)
    c = page.condition
    if c.switch1_valid
      return false unless $game_switches[c.switch1_id]
    }
    if c.switch2_valid
      return false unless $game_switches[c.switch2_id]
    }
    if c.variable_valid
      return false if $game_variables[c.variable_id] < c.variable_value
    }
    if c.self_switch_valid
      key = [@map_id, @event.id, c.self_switch_ch]
      return false if $game_self_switches[key] != true
    }
    if c.item_valid
      item = $data_items[c.item_id]
      return false unless $game_party.has_item?(item)
    }
    if c.actor_valid
      actor = $game_actors[c.actor_id]
      return false unless $game_party.members.include?(actor)
    }
    return true
  }
  //--------------------------------------------------------------------------
  // ● イベントページのセットアップ
  //--------------------------------------------------------------------------
  public setup_page(new_page)
    @page = new_page
    if @page
      setup_page_settings
    else
      clear_page_settings
    }
    update_bush_depth
    clear_starting_flag
    check_event_trigger_auto
  }
  //--------------------------------------------------------------------------
  // ● イベントページの設定をクリア
  //--------------------------------------------------------------------------
  public clear_page_settings
    @tile_id          = 0
    @character_name   = ""
    @character_index  = 0
    @move_type        = 0
    @through          = true
    @trigger          = nil
    @list             = nil
    @interpreter      = nil
  }
  //--------------------------------------------------------------------------
  // ● イベントページの設定をセットアップ
  //--------------------------------------------------------------------------
  public setup_page_settings
    @tile_id          = @page.graphic.tile_id
    @character_name   = @page.graphic.character_name
    @character_index  = @page.graphic.character_index
    if @original_direction != @page.graphic.direction
      @direction          = @page.graphic.direction
      @original_direction = @direction
      @prelock_direction  = 0
    }
    if @original_pattern != @page.graphic.pattern
      @pattern            = @page.graphic.pattern
      @original_pattern   = @pattern
    }
    @move_type          = @page.move_type
    @move_speed         = @page.move_speed
    @move_frequency     = @page.move_frequency
    @move_route         = @page.move_route
    @move_route_index   = 0
    @move_route_forcing = false
    @walk_anime         = @page.walk_anime
    @step_anime         = @page.step_anime
    @direction_fix      = @page.direction_fix
    @through            = @page.through
    @priority_type      = @page.priority_type
    @trigger            = @page.trigger
    @list               = @page.list
    @interpreter = @trigger == 4 ? Game_Interpreter.new : nil
  }
  //--------------------------------------------------------------------------
  // ● 接触イベントの起動判定
  //--------------------------------------------------------------------------
  public check_event_trigger_touch(x, y)
    return if $game_map.interpreter.running?
    if @trigger == 2 && $game_player.pos?(x, y)
      start if !jumping? && normal_priority?
    }
  }
  //--------------------------------------------------------------------------
  // ● 自動イベントの起動判定
  //--------------------------------------------------------------------------
  public check_event_trigger_auto
    start if @trigger == 3
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    super
    check_event_trigger_auto
    return unless @interpreter
    @interpreter.setup(@list, @event.id) unless @interpreter.running?
    @interpreter.update
  }
}
