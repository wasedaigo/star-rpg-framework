//==============================================================================
// ■ Game_Player
//------------------------------------------------------------------------------
// 　プレイヤーを扱うクラスです。イベントの起動判定や、マップのスクロールなどの
// 機能を持っています。このクラスのインスタンスは $game_player で参照されます。
//==============================================================================

class Game_Player < Game_Character
  //--------------------------------------------------------------------------
  // ● 公開インスタンス変数
  //--------------------------------------------------------------------------
  attr_reader   :followers                // フォロワー（隊列メンバー）
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize
    super
    @vehicle_type = :walk           // 現在乗っている乗り物の種類
    @vehicle_getting_on = false     // 乗る動作の途中フラグ
    @vehicle_getting_off = false    // 降りる動作の途中フラグ
    @followers = Game_Followers.new(self)
    @transparent = $data_system.opt_transparent
    clear_transfer_info
  }
  //--------------------------------------------------------------------------
  // ● 場所移動情報のクリア
  //--------------------------------------------------------------------------
  public clear_transfer_info
    @transferring = false           // 場所移動フラグ
    @new_map_id = 0                 // 移動先 マップ ID
    @new_x = 0                      // 移動先 X 座標
    @new_y = 0                      // 移動先 Y 座標
    @new_direction = 0              // 移動後の向き
  }
  //--------------------------------------------------------------------------
  // ● リフレッシュ
  //--------------------------------------------------------------------------
  public refresh
    @character_name = actor ? actor.character_name : ""
    @character_index = actor ? actor.character_index : 0
    @followers.refresh
  }
  //--------------------------------------------------------------------------
  // ● 対応するアクターの取得
  //--------------------------------------------------------------------------
  public actor
    $game_party.battle_members[0]
  }
  //--------------------------------------------------------------------------
  // ● 停止中判定
  //--------------------------------------------------------------------------
  public stopping?
    return false if @vehicle_getting_on || @vehicle_getting_off
    return super
  }
  //--------------------------------------------------------------------------
  // ● 場所移動の予約
  //     d : 移動後の向き（2,4,6,8）
  //--------------------------------------------------------------------------
  public reserve_transfer(map_id, x, y, d = 2)
    @transferring = true
    @new_map_id = map_id
    @new_x = x
    @new_y = y
    @new_direction = d
  }
  //--------------------------------------------------------------------------
  // ● 場所移動の予約中判定
  //--------------------------------------------------------------------------
  public transfer?
    @transferring
  }
  //--------------------------------------------------------------------------
  // ● 場所移動の実行
  //--------------------------------------------------------------------------
  public perform_transfer
    if transfer?
      set_direction(@new_direction)
      if @new_map_id != $game_map.map_id
        $game_map.setup(@new_map_id)
        $game_map.autoplay
      }
      moveto(@new_x, @new_y)
      clear_transfer_info
    }
  }
  //--------------------------------------------------------------------------
  // ● マップ通行可能判定
  //     d : 方向（2,4,6,8）
  //--------------------------------------------------------------------------
  public map_passable?(x, y, d)
    case @vehicle_type
    when :boat
      $game_map.boat_passable?(x, y)
    when :ship
      $game_map.ship_passable?(x, y)
    when :airship
      true
    else
      super
    }
  }
  //--------------------------------------------------------------------------
  // ● 現在乗っている乗り物を取得
  //--------------------------------------------------------------------------
  public vehicle
    $game_map.vehicle(@vehicle_type)
  }
  //--------------------------------------------------------------------------
  // ● 小型船に乗っている状態判定
  //--------------------------------------------------------------------------
  public in_boat?
    @vehicle_type == :boat
  }
  //--------------------------------------------------------------------------
  // ● 大型船に乗っている状態判定
  //--------------------------------------------------------------------------
  public in_ship?
    @vehicle_type == :ship
  }
  //--------------------------------------------------------------------------
  // ● 飛行船に乗っている状態判定
  //--------------------------------------------------------------------------
  public in_airship?
    @vehicle_type == :airship
  }
  //--------------------------------------------------------------------------
  // ● 通常歩行状態判定
  //--------------------------------------------------------------------------
  public normal_walk?
    @vehicle_type == :walk && !@move_route_forcing
  }
  //--------------------------------------------------------------------------
  // ● ダッシュ状態判定
  //--------------------------------------------------------------------------
  public dash?
    return false if @move_route_forcing
    return false if $game_map.disable_dash?
    return false if vehicle
    return Input.press?(:A)
  }
  //--------------------------------------------------------------------------
  // ● デバッグすり抜け状態判定
  //--------------------------------------------------------------------------
  public debug_through?
    $TEST && Input.press?(:CTRL)
  }
  //--------------------------------------------------------------------------
  // ● 衝突判定（フォロワーを含む）
  //--------------------------------------------------------------------------
  public collide?(x, y)
    !@through && (pos?(x, y) || followers.collide?(x, y))
  }
  //--------------------------------------------------------------------------
  // ● 画面中央の X 座標
  //--------------------------------------------------------------------------
  public center_x
    (Graphics.width / 32 - 1) / 2.0
  }
  //--------------------------------------------------------------------------
  // ● 画面中央の Y 座標
  //--------------------------------------------------------------------------
  public center_y
    (Graphics.height / 32 - 1) / 2.0
  }
  //--------------------------------------------------------------------------
  // ● 画面中央に来るようにマップの表示位置を設定
  //--------------------------------------------------------------------------
  public center(x, y)
    $game_map.set_display_pos(x - center_x, y - center_y)
  }
  //--------------------------------------------------------------------------
  // ● 指定位置に移動
  //--------------------------------------------------------------------------
  public moveto(x, y)
    super
    center(x, y)
    make_encounter_count
    vehicle.refresh if vehicle
    @followers.synchronize(x, y, direction)
  }
  //--------------------------------------------------------------------------
  // ● 歩数増加
  //--------------------------------------------------------------------------
  public increase_steps
    super
    $game_party.increase_steps if normal_walk?
  }
  //--------------------------------------------------------------------------
  // ● エンカウント カウント作成
  //--------------------------------------------------------------------------
  public make_encounter_count
    n = $game_map.encounter_step
    @encounter_count = rand(n) + rand(n) + 1
  }
  //--------------------------------------------------------------------------
  // ● エンカウントする敵グループの ID を作成
  //--------------------------------------------------------------------------
  public make_encounter_troop_id
    encounter_list = []
    weight_sum = 0
    $game_map.encounter_list.each do |encounter|
      next unless encounter_ok?(encounter)
      encounter_list.push(encounter)
      weight_sum += encounter.weight
    }
    if weight_sum > 0
      value = rand(weight_sum)
      encounter_list.each do |encounter|
        value -= encounter.weight
        return encounter.troop_id if value < 0
      }
    }
    return 0
  }
  //--------------------------------------------------------------------------
  // ● エンカウント項目の採用可能判定
  //--------------------------------------------------------------------------
  public encounter_ok?(encounter)
    return true if encounter.region_set.empty?
    return true if encounter.region_set.include?(region_id)
    return false
  }
  //--------------------------------------------------------------------------
  // ● エンカウント処理の実行
  //--------------------------------------------------------------------------
  public encounter
    return false if $game_map.interpreter.running?
    return false if $game_system.encounter_disabled
    return false if @encounter_count > 0
    make_encounter_count
    troop_id = make_encounter_troop_id
    return false unless $data_troops[troop_id]
    BattleManager.setup(troop_id)
    BattleManager.on_encounter
    return true
  }
  //--------------------------------------------------------------------------
  // ● マップイベントの起動
  //     triggers : トリガーの配列
  //     normal   : プライオリティ［通常キャラと同じ］かそれ以外か
  //--------------------------------------------------------------------------
  public start_map_event(x, y, triggers, normal)
    $game_map.events_xy(x, y).each do |event|
      if event.trigger_in?(triggers) && event.normal_priority? == normal
        event.start
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● 同位置のイベント起動判定
  //--------------------------------------------------------------------------
  public check_event_trigger_here(triggers)
    start_map_event(@x, @y, triggers, false)
  }
  //--------------------------------------------------------------------------
  // ● 正面のイベント起動判定
  //--------------------------------------------------------------------------
  public check_event_trigger_there(triggers)
    x2 = $game_map.round_x_with_direction(@x, @direction)
    y2 = $game_map.round_y_with_direction(@y, @direction)
    start_map_event(x2, y2, triggers, true)
    return if $game_map.any_event_starting?
    return unless $game_map.counter?(x2, y2)
    x3 = $game_map.round_x_with_direction(x2, @direction)
    y3 = $game_map.round_y_with_direction(y2, @direction)
    start_map_event(x3, y3, triggers, true)
  }
  //--------------------------------------------------------------------------
  // ● 接触イベントの起動判定
  //--------------------------------------------------------------------------
  public check_event_trigger_touch(x, y)
    start_map_event(x, y, [1,2], true)
  }
  //--------------------------------------------------------------------------
  // ● 方向ボタン入力による移動処理
  //--------------------------------------------------------------------------
  public move_by_input
    return if !movable? || $game_map.interpreter.running?
    move_straight(Input.dir4) if Input.dir4 > 0
  }
  //--------------------------------------------------------------------------
  // ● 移動可能判定
  //--------------------------------------------------------------------------
  public movable?
    return false if moving?
    return false if @move_route_forcing || @followers.gathering?
    return false if @vehicle_getting_on || @vehicle_getting_off
    return false if $game_message.busy? || $game_message.visible
    return false if vehicle && !vehicle.movable?
    return true
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    last_real_x = @real_x
    last_real_y = @real_y
    last_moving = moving?
    move_by_input
    super
    update_scroll(last_real_x, last_real_y)
    update_vehicle
    update_nonmoving(last_moving) unless moving?
    @followers.update
  }
  //--------------------------------------------------------------------------
  // ● スクロール処理
  //--------------------------------------------------------------------------
  public update_scroll(last_real_x, last_real_y)
    ax1 = $game_map.adjust_x(last_real_x)
    ay1 = $game_map.adjust_y(last_real_y)
    ax2 = $game_map.adjust_x(@real_x)
    ay2 = $game_map.adjust_y(@real_y)
    $game_map.scroll_down (ay2 - ay1) if ay2 > ay1 && ay2 > center_y
    $game_map.scroll_left (ax1 - ax2) if ax2 < ax1 && ax2 < center_x
    $game_map.scroll_right(ax2 - ax1) if ax2 > ax1 && ax2 > center_x
    $game_map.scroll_up   (ay1 - ay2) if ay2 < ay1 && ay2 < center_y
  }
  //--------------------------------------------------------------------------
  // ● 乗り物の処理
  //--------------------------------------------------------------------------
  public update_vehicle
    return if @followers.gathering?
    return unless vehicle
    if @vehicle_getting_on
      update_vehicle_get_on
    elsif @vehicle_getting_off
      update_vehicle_get_off
    else
      vehicle.sync_with_player
    }
  }
  //--------------------------------------------------------------------------
  // ● 乗り物に乗る動作の更新
  //--------------------------------------------------------------------------
  public update_vehicle_get_on
    if !@followers.gathering? && !moving?
      @direction = vehicle.direction
      @move_speed = vehicle.speed
      @vehicle_getting_on = false
      @transparent = true
      @through = true if in_airship?
      vehicle.get_on
    }
  }
  //--------------------------------------------------------------------------
  // ● 乗り物から降りる動作の更新
  //--------------------------------------------------------------------------
  public update_vehicle_get_off
    if !@followers.gathering? && vehicle.altitude == 0
      @vehicle_getting_off = false
      @vehicle_type = :walk
      @transparent = false
    }
  }
  //--------------------------------------------------------------------------
  // ● 移動中でない場合の処理
  //     last_moving : 直前に移動中だったか
  //--------------------------------------------------------------------------
  public update_nonmoving(last_moving)
    return if $game_map.interpreter.running?
    if last_moving
      $game_party.on_player_walk
      return if check_touch_event
    }
    if movable? && Input.trigger?(:C)
      return if get_on_off_vehicle
      return if check_action_event
    }
    update_encounter if last_moving
  }
  //--------------------------------------------------------------------------
  // ● エンカウントの更新
  //--------------------------------------------------------------------------
  public update_encounter
    return if $TEST && Input.press?(:CTRL)
    return if $game_party.encounter_none?
    return if in_airship?
    return if @move_route_forcing
    @encounter_count -= encounter_progress_value
  }
  //--------------------------------------------------------------------------
  // ● エンカウント進行値の取得
  //--------------------------------------------------------------------------
  public encounter_progress_value
    value = $game_map.bush?(@x, @y) ? 2 : 1
    value *= 0.5 if $game_party.encounter_half?
    value *= 0.5 if in_ship?
    value
  }
  //--------------------------------------------------------------------------
  // ● 接触（重なり）によるイベント起動判定
  //--------------------------------------------------------------------------
  public check_touch_event
    return false if in_airship?
    check_event_trigger_here([1,2])
    $game_map.setup_starting_event
  }
  //--------------------------------------------------------------------------
  // ● 決定ボタンによるイベント起動判定
  //--------------------------------------------------------------------------
  public check_action_event
    return false if in_airship?
    check_event_trigger_here([0])
    return true if $game_map.setup_starting_event
    check_event_trigger_there([0,1,2])
    $game_map.setup_starting_event
  }
  //--------------------------------------------------------------------------
  // ● 乗り物の乗降
  //--------------------------------------------------------------------------
  public get_on_off_vehicle
    if vehicle
      get_off_vehicle
    else
      get_on_vehicle
    }
  }
  //--------------------------------------------------------------------------
  // ● 乗り物に乗る
  //    現在乗り物に乗っていないことが前提。
  //--------------------------------------------------------------------------
  public get_on_vehicle
    front_x = $game_map.round_x_with_direction(@x, @direction)
    front_y = $game_map.round_y_with_direction(@y, @direction)
    @vehicle_type = :boat    if $game_map.boat.pos?(front_x, front_y)
    @vehicle_type = :ship    if $game_map.ship.pos?(front_x, front_y)
    @vehicle_type = :airship if $game_map.airship.pos?(@x, @y)
    if vehicle
      @vehicle_getting_on = true
      force_move_forward unless in_airship?
      @followers.gather
    }
    @vehicle_getting_on
  }
  //--------------------------------------------------------------------------
  // ● 乗り物から降りる
  //    現在乗り物に乗っていることが前提。
  //--------------------------------------------------------------------------
  public get_off_vehicle
    if vehicle.land_ok?(@x, @y, @direction)
      set_direction(2) if in_airship?
      @followers.synchronize(@x, @y, @direction)
      vehicle.get_off
      unless in_airship?
        force_move_forward
        @transparent = false
      }
      @vehicle_getting_off = true
      @move_speed = 4
      @through = false
      make_encounter_count
      @followers.gather
    }
    @vehicle_getting_off
  }
  //--------------------------------------------------------------------------
  // ● 強制的に一歩前進
  //--------------------------------------------------------------------------
  public force_move_forward
    @through = true
    move_forward
    @through = false
  }
  //--------------------------------------------------------------------------
  // ● ダメージ床判定
  //--------------------------------------------------------------------------
  public on_damage_floor?
    $game_map.damage_floor?(@x, @y) && !in_airship?
  }
  //--------------------------------------------------------------------------
  // ● まっすぐに移動
  //--------------------------------------------------------------------------
  public move_straight(d, turn_ok = true)
    @followers.move if passable?(@x, @y, d)
    super
  }
  //--------------------------------------------------------------------------
  // ● 斜めに移動
  //--------------------------------------------------------------------------
  public move_diagonal(horz, vert)
    @followers.move if diagonal_passable?(@x, @y, horz, vert)
    super
  }
}
