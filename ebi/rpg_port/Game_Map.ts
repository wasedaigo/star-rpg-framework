//==============================================================================
// ■ Game_Map
//------------------------------------------------------------------------------
// 　マップを扱うクラスです。スクロールや通行可能判定などの機能を持っています。
// このクラスのインスタンスは $game_map で参照されます。
//==============================================================================

class Game_Map
  //--------------------------------------------------------------------------
  // ● 公開インスタンス変数
  //--------------------------------------------------------------------------
  attr_reader   :screen                   // マップ画面の状態
  attr_reader   :interpreter              // マップイベント用インタプリタ
  attr_reader   :events                   // イベント
  attr_reader   :display_x                // 表示 X 座標
  attr_reader   :display_y                // 表示 Y 座標
  attr_reader   :parallax_name            // 遠景 ファイル名
  attr_reader   :vehicles                 // 乗り物
  attr_reader   :battleback1_name         // 戦闘背景（床）ファイル名
  attr_reader   :battleback2_name         // 戦闘背景（壁）ファイル名
  attr_accessor :name_display             // マップ名表示フラグ
  attr_accessor :need_refresh             // リフレッシュ要求フラグ
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize
    @screen = Game_Screen.new
    @interpreter = Game_Interpreter.new
    @map_id = 0
    @events = {}
    @display_x = 0
    @display_y = 0
    create_vehicles
    @name_display = true
  }
  //--------------------------------------------------------------------------
  // ● セットアップ
  //--------------------------------------------------------------------------
  public setup(map_id)
    @map_id = map_id
    @map = load_data(sprintf("Data/Map%03d.rvdata2", @map_id))
    @tileset_id = @map.tileset_id
    @display_x = 0
    @display_y = 0
    referesh_vehicles
    setup_events
    setup_scroll
    setup_parallax
    setup_battleback
    @need_refresh = false
  }
  //--------------------------------------------------------------------------
  // ● 乗り物の作成
  //--------------------------------------------------------------------------
  public create_vehicles
    @vehicles = []
    @vehicles[0] = Game_Vehicle.new(:boat)
    @vehicles[1] = Game_Vehicle.new(:ship)
    @vehicles[2] = Game_Vehicle.new(:airship)
  }
  //--------------------------------------------------------------------------
  // ● 乗り物のリフレッシュ
  //--------------------------------------------------------------------------
  public referesh_vehicles
    @vehicles.each {|vehicle| vehicle.refresh }
  }
  //--------------------------------------------------------------------------
  // ● 乗り物の取得
  //--------------------------------------------------------------------------
  public vehicle(type)
    return @vehicles[0] if type == :boat
    return @vehicles[1] if type == :ship
    return @vehicles[2] if type == :airship
    return nil
  }
  //--------------------------------------------------------------------------
  // ● 小型船の取得
  //--------------------------------------------------------------------------
  public boat
    @vehicles[0]
  }
  //--------------------------------------------------------------------------
  // ● 大型船の取得
  //--------------------------------------------------------------------------
  public ship
    @vehicles[1]
  }
  //--------------------------------------------------------------------------
  // ● 飛行船の取得
  //--------------------------------------------------------------------------
  public airship
    @vehicles[2]
  }
  //--------------------------------------------------------------------------
  // ● イベントのセットアップ
  //--------------------------------------------------------------------------
  public setup_events
    @events = {}
    @map.events.each do |i, event|
      @events[i] = Game_Event.new(@map_id, event)
    }
    @common_events = parallel_common_events.collect do |common_event|
      Game_CommonEvent.new(common_event.id)
    }
    refresh_tile_events
  }
  //--------------------------------------------------------------------------
  // ● 並列処理コモンイベントの配列を取得
  //--------------------------------------------------------------------------
  public parallel_common_events
    $data_common_events.select {|event| event && event.parallel? }
  }
  //--------------------------------------------------------------------------
  // ● スクロールのセットアップ
  //--------------------------------------------------------------------------
  public setup_scroll
    @scroll_direction = 2
    @scroll_rest = 0
    @scroll_speed = 4
  }
  //--------------------------------------------------------------------------
  // ● 遠景のセットアップ
  //--------------------------------------------------------------------------
  public setup_parallax
    @parallax_name = @map.parallax_name
    @parallax_loop_x = @map.parallax_loop_x
    @parallax_loop_y = @map.parallax_loop_y
    @parallax_sx = @map.parallax_sx
    @parallax_sy = @map.parallax_sy
    @parallax_x = 0
    @parallax_y = 0
  }
  //--------------------------------------------------------------------------
  // ● 戦闘背景のセットアップ
  //--------------------------------------------------------------------------
  public setup_battleback
    if @map.specify_battleback
      @battleback1_name = @map.battleback1_name
      @battleback2_name = @map.battleback2_name
    else
      @battleback1_name = nil
      @battleback2_name = nil
    }
  }
  //--------------------------------------------------------------------------
  // ● 表示位置の設定
  //--------------------------------------------------------------------------
  public set_display_pos(x, y)
    x = [0, [x, width - screen_tile_x].min].max unless loop_horizontal?
    y = [0, [y, height - screen_tile_y].min].max unless loop_vertical?
    @display_x = (x + width) % width
    @display_y = (y + height) % height
    @parallax_x = x
    @parallax_y = y
  }
  //--------------------------------------------------------------------------
  // ● 遠景表示の原点 X 座標の計算
  //--------------------------------------------------------------------------
  public parallax_ox(bitmap)
    if @parallax_loop_x
      @parallax_x * 16
    else
      w1 = [bitmap.width - Graphics.width, 0].max
      w2 = [width * 32 - Graphics.width, 1].max
      @parallax_x * 16 * w1 / w2
    }
  }
  //--------------------------------------------------------------------------
  // ● 遠景表示の原点 Y 座標の計算
  //--------------------------------------------------------------------------
  public parallax_oy(bitmap)
    if @parallax_loop_y
      @parallax_y * 16
    else
      h1 = [bitmap.height - Graphics.height, 0].max
      h2 = [height * 32 - Graphics.height, 1].max
      @parallax_y * 16 * h1 / h2
    }
  }
  //--------------------------------------------------------------------------
  // ● マップ ID の取得
  //--------------------------------------------------------------------------
  public map_id
    @map_id
  }
  //--------------------------------------------------------------------------
  // ● タイルセットの取得
  //--------------------------------------------------------------------------
  public tileset
    $data_tilesets[@tileset_id]
  }
  //--------------------------------------------------------------------------
  // ● 表示名の取得
  //--------------------------------------------------------------------------
  public display_name
    @map.display_name
  }
  //--------------------------------------------------------------------------
  // ● 幅の取得
  //--------------------------------------------------------------------------
  public width
    @map.width
  }
  //--------------------------------------------------------------------------
  // ● 高さの取得
  //--------------------------------------------------------------------------
  public height
    @map.height
  }
  //--------------------------------------------------------------------------
  // ● 横方向にループするか？
  //--------------------------------------------------------------------------
  public loop_horizontal?
    @map.scroll_type == 2 || @map.scroll_type == 3
  }
  //--------------------------------------------------------------------------
  // ● 縦方向にループするか？
  //--------------------------------------------------------------------------
  public loop_vertical?
    @map.scroll_type == 1 || @map.scroll_type == 3
  }
  //--------------------------------------------------------------------------
  // ● ダッシュ禁止か否かの取得
  //--------------------------------------------------------------------------
  public disable_dash?
    @map.disable_dashing
  }
  //--------------------------------------------------------------------------
  // ● エンカウントリストの取得
  //--------------------------------------------------------------------------
  public encounter_list
    @map.encounter_list
  }
  //--------------------------------------------------------------------------
  // ● エンカウント歩数の取得
  //--------------------------------------------------------------------------
  public encounter_step
    @map.encounter_step
  }
  //--------------------------------------------------------------------------
  // ● マップデータの取得
  //--------------------------------------------------------------------------
  public data
    @map.data
  }
  //--------------------------------------------------------------------------
  // ● フィールドタイプか否か
  //--------------------------------------------------------------------------
  public overworld?
    tileset.mode == 0
  }
  //--------------------------------------------------------------------------
  // ● 画面の横タイル数
  //--------------------------------------------------------------------------
  public screen_tile_x
    Graphics.width / 32
  }
  //--------------------------------------------------------------------------
  // ● 画面の縦タイル数
  //--------------------------------------------------------------------------
  public screen_tile_y
    Graphics.height / 32
  }
  //--------------------------------------------------------------------------
  // ● 表示座標を差し引いた X 座標の計算
  //--------------------------------------------------------------------------
  public adjust_x(x)
    if loop_horizontal? && x < @display_x - (width - screen_tile_x) / 2
      x - @display_x + @map.width
    else
      x - @display_x
    }
  }
  //--------------------------------------------------------------------------
  // ● 表示座標を差し引いた Y 座標の計算
  //--------------------------------------------------------------------------
  public adjust_y(y)
    if loop_vertical? && y < @display_y - (height - screen_tile_y) / 2
      y - @display_y + @map.height
    else
      y - @display_y
    }
  }
  //--------------------------------------------------------------------------
  // ● ループ補正後の X 座標計算
  //--------------------------------------------------------------------------
  public round_x(x)
    loop_horizontal? ? (x + width) % width : x
  }
  //--------------------------------------------------------------------------
  // ● ループ補正後の Y 座標計算
  //--------------------------------------------------------------------------
  public round_y(y)
    loop_vertical? ? (y + height) % height : y
  }
  //--------------------------------------------------------------------------
  // ● 特定の方向に 1 マスずらした X 座標の計算（ループ補正なし）
  //--------------------------------------------------------------------------
  public x_with_direction(x, d)
    x + (d == 6 ? 1 : d == 4 ? -1 : 0)
  }
  //--------------------------------------------------------------------------
  // ● 特定の方向に 1 マスずらした Y 座標の計算（ループ補正なし）
  //--------------------------------------------------------------------------
  public y_with_direction(y, d)
    y + (d == 2 ? 1 : d == 8 ? -1 : 0)
  }
  //--------------------------------------------------------------------------
  // ● 特定の方向に 1 マスずらした X 座標の計算（ループ補正あり）
  //--------------------------------------------------------------------------
  public round_x_with_direction(x, d)
    round_x(x + (d == 6 ? 1 : d == 4 ? -1 : 0))
  }
  //--------------------------------------------------------------------------
  // ● 特定の方向に 1 マスずらした Y 座標の計算（ループ補正あり）
  //--------------------------------------------------------------------------
  public round_y_with_direction(y, d)
    round_y(y + (d == 2 ? 1 : d == 8 ? -1 : 0))
  }
  //--------------------------------------------------------------------------
  // ● BGM / BGS 自動切り替え
  //--------------------------------------------------------------------------
  public autoplay
    @map.bgm.play if @map.autoplay_bgm
    @map.bgs.play if @map.autoplay_bgs
  }
  //--------------------------------------------------------------------------
  // ● リフレッシュ
  //--------------------------------------------------------------------------
  public refresh
    @events.each_value {|event| event.refresh }
    @common_events.each {|event| event.refresh }
    refresh_tile_events
    @need_refresh = false
  }
  //--------------------------------------------------------------------------
  // ● タイル扱いイベントの配列をリフレッシュ
  //--------------------------------------------------------------------------
  public refresh_tile_events
    @tile_events = @events.values.select {|event| event.tile? }
  }
  //--------------------------------------------------------------------------
  // ● 指定座標に存在するイベントの配列取得
  //--------------------------------------------------------------------------
  public events_xy(x, y)
    @events.values.select {|event| event.pos?(x, y) }
  }
  //--------------------------------------------------------------------------
  // ● 指定座標に存在するイベント（すり抜け以外）の配列取得
  //--------------------------------------------------------------------------
  public events_xy_nt(x, y)
    @events.values.select {|event| event.pos_nt?(x, y) }
  }
  //--------------------------------------------------------------------------
  // ● 指定座標に存在するタイル扱いイベント（すり抜け以外）の配列取得
  //--------------------------------------------------------------------------
  public tile_events_xy(x, y)
    @tile_events.select {|event| event.pos_nt?(x, y) }
  }
  //--------------------------------------------------------------------------
  // ● 指定座標に存在するイベントの ID 取得（一つのみ）
  //--------------------------------------------------------------------------
  public event_id_xy(x, y)
    list = events_xy(x, y)
    list.empty? ? 0 : list[0].id
  }
  //--------------------------------------------------------------------------
  // ● 下にスクロール
  //--------------------------------------------------------------------------
  public scroll_down(distance)
    if loop_vertical?
      @display_y += distance
      @display_y %= @map.height
      @parallax_y += distance if @parallax_loop_y
    else
      last_y = @display_y
      @display_y = [@display_y + distance, height - screen_tile_y].min
      @parallax_y += @display_y - last_y
    }
  }
  //--------------------------------------------------------------------------
  // ● 左にスクロール
  //--------------------------------------------------------------------------
  public scroll_left(distance)
    if loop_horizontal?
      @display_x += @map.width - distance
      @display_x %= @map.width 
      @parallax_x -= distance if @parallax_loop_x
    else
      last_x = @display_x
      @display_x = [@display_x - distance, 0].max
      @parallax_x += @display_x - last_x
    }
  }
  //--------------------------------------------------------------------------
  // ● 右にスクロール
  //--------------------------------------------------------------------------
  public scroll_right(distance)
    if loop_horizontal?
      @display_x += distance
      @display_x %= @map.width
      @parallax_x += distance if @parallax_loop_x
    else
      last_x = @display_x
      @display_x = [@display_x + distance, (width - screen_tile_x)].min
      @parallax_x += @display_x - last_x
    }
  }
  //--------------------------------------------------------------------------
  // ● 上にスクロール
  //--------------------------------------------------------------------------
  public scroll_up(distance)
    if loop_vertical?
      @display_y += @map.height - distance
      @display_y %= @map.height
      @parallax_y -= distance if @parallax_loop_y
    else
      last_y = @display_y
      @display_y = [@display_y - distance, 0].max
      @parallax_y += @display_y - last_y
    }
  }
  //--------------------------------------------------------------------------
  // ● 有効座標判定
  //--------------------------------------------------------------------------
  public valid?(x, y)
    x >= 0 && x < width && y >= 0 && y < height
  }
  //--------------------------------------------------------------------------
  // ● 通行チェック
  //     bit : 調べる通行禁止ビット
  //--------------------------------------------------------------------------
  public check_passage(x, y, bit)
    all_tiles(x, y).each do |tile_id|
      flag = tileset.flags[tile_id]
      next if flag & 0x10 != 0            // [☆] : 通行に影響しない
      return true  if flag & bit == 0     // [○] : 通行可
      return false if flag & bit == bit   // [×] : 通行不可
    }
    return false                          // 通行不可
  }
  //--------------------------------------------------------------------------
  // ● 指定座標にあるタイル ID の取得
  //--------------------------------------------------------------------------
  public tile_id(x, y, z)
    @map.data[x, y, z] || 0
  }
  //--------------------------------------------------------------------------
  // ● 指定座標にある全レイヤーのタイル（上から順）を配列で取得
  //--------------------------------------------------------------------------
  public layered_tiles(x, y)
    [2, 1, 0].collect {|z| tile_id(x, y, z) }
  }
  //--------------------------------------------------------------------------
  // ● 指定座標にある全てのタイル（イベント含む）を配列で取得
  //--------------------------------------------------------------------------
  public all_tiles(x, y)
    tile_events_xy(x, y).collect {|ev| ev.tile_id } + layered_tiles(x, y)
  }
  //--------------------------------------------------------------------------
  // ● 指定座標にあるオートタイルの種類を取得
  //--------------------------------------------------------------------------
  public autotile_type(x, y, z)
    tile_id(x, y, z) >= 2048 ? (tile_id(x, y, z) - 2048) / 48 : -1
  }
  //--------------------------------------------------------------------------
  // ● 通常キャラの通行可能判定
  //     d : 方向（2,4,6,8）
  //    指定された座標のタイルが指定方向に通行可能かを判定する。
  //--------------------------------------------------------------------------
  public passable?(x, y, d)
    check_passage(x, y, (1 << (d / 2 - 1)) & 0x0f)
  }
  //--------------------------------------------------------------------------
  // ● 小型船の通行可能判定
  //--------------------------------------------------------------------------
  public boat_passable?(x, y)
    check_passage(x, y, 0x0200)
  }
  //--------------------------------------------------------------------------
  // ● 大型船の通行可能判定
  //--------------------------------------------------------------------------
  public ship_passable?(x, y)
    check_passage(x, y, 0x0400)
  }
  //--------------------------------------------------------------------------
  // ● 飛行船の着陸可能判定
  //--------------------------------------------------------------------------
  public airship_land_ok?(x, y)
    check_passage(x, y, 0x0800) && check_passage(x, y, 0x0f)
  }
  //--------------------------------------------------------------------------
  // ● 指定座標の全レイヤーのフラグ判定
  //--------------------------------------------------------------------------
  public layered_tiles_flag?(x, y, bit)
    layered_tiles(x, y).any? {|tile_id| tileset.flags[tile_id] & bit != 0 }
  }
  //--------------------------------------------------------------------------
  // ● 梯子判定
  //--------------------------------------------------------------------------
  public ladder?(x, y)
    valid?(x, y) && layered_tiles_flag?(x, y, 0x20)
  }
  //--------------------------------------------------------------------------
  // ● 茂み判定
  //--------------------------------------------------------------------------
  public bush?(x, y)
    valid?(x, y) && layered_tiles_flag?(x, y, 0x40)
  }
  //--------------------------------------------------------------------------
  // ● カウンター判定
  //--------------------------------------------------------------------------
  public counter?(x, y)
    valid?(x, y) && layered_tiles_flag?(x, y, 0x80)
  }
  //--------------------------------------------------------------------------
  // ● ダメージ床判定
  //--------------------------------------------------------------------------
  public damage_floor?(x, y)
    valid?(x, y) && layered_tiles_flag?(x, y, 0x100)
  }
  //--------------------------------------------------------------------------
  // ● 地形タグの取得
  //--------------------------------------------------------------------------
  public terrain_tag(x, y)
    return 0 unless valid?(x, y)
    layered_tiles(x, y).each do |tile_id|
      tag = tileset.flags[tile_id] >> 12
      return tag if tag > 0
    }
    return 0
  }
  //--------------------------------------------------------------------------
  // ● リージョン ID の取得
  //--------------------------------------------------------------------------
  public region_id(x, y)
    valid?(x, y) ? @map.data[x, y, 3] >> 8 : 0
  }
  //--------------------------------------------------------------------------
  // ● スクロールの開始
  //--------------------------------------------------------------------------
  public start_scroll(direction, distance, speed)
    @scroll_direction = direction
    @scroll_rest = distance
    @scroll_speed = speed
  }
  //--------------------------------------------------------------------------
  // ● スクロール中判定
  //--------------------------------------------------------------------------
  public scrolling?
    @scroll_rest > 0
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //     main : インタプリタ更新フラグ
  //--------------------------------------------------------------------------
  public update(main = false)
    refresh if @need_refresh
    update_interpreter if main
    update_scroll
    update_events
    update_vehicles
    update_parallax
    @screen.update
  }
  //--------------------------------------------------------------------------
  // ● スクロールの更新
  //--------------------------------------------------------------------------
  public update_scroll
    return unless scrolling?
    last_x = @display_x
    last_y = @display_y
    do_scroll(@scroll_direction, scroll_distance)
    if @display_x == last_x && @display_y == last_y
      @scroll_rest = 0
    else
      @scroll_rest -= scroll_distance
    }
  }
  //--------------------------------------------------------------------------
  // ● スクロール距離の計算
  //--------------------------------------------------------------------------
  public scroll_distance
    2 ** @scroll_speed / 256.0
  }
  //--------------------------------------------------------------------------
  // ● スクロールの実行
  //--------------------------------------------------------------------------
  public do_scroll(direction, distance)
    case direction
    when 2;  scroll_down (distance)
    when 4;  scroll_left (distance)
    when 6;  scroll_right(distance)
    when 8;  scroll_up   (distance)
    }
  }
  //--------------------------------------------------------------------------
  // ● イベントの更新
  //--------------------------------------------------------------------------
  public update_events
    @events.each_value {|event| event.update }
    @common_events.each {|event| event.update }
  }
  //--------------------------------------------------------------------------
  // ● 乗り物の更新
  //--------------------------------------------------------------------------
  public update_vehicles
    @vehicles.each {|vehicle| vehicle.update }
  }
  //--------------------------------------------------------------------------
  // ● 遠景の更新
  //--------------------------------------------------------------------------
  public update_parallax
    @parallax_x += @parallax_sx / 64.0 if @parallax_loop_x
    @parallax_y += @parallax_sy / 64.0 if @parallax_loop_y
  }
  //--------------------------------------------------------------------------
  // ● タイルセットの変更
  //--------------------------------------------------------------------------
  public change_tileset(tileset_id)
    @tileset_id = tileset_id
    refresh
  }
  //--------------------------------------------------------------------------
  // ● 戦闘背景の変更
  //--------------------------------------------------------------------------
  public change_battleback(battleback1_name, battleback2_name)
    @battleback1_name = battleback1_name
    @battleback2_name = battleback2_name
  }
  //--------------------------------------------------------------------------
  // ● 遠景の変更
  //--------------------------------------------------------------------------
  public change_parallax(name, loop_x, loop_y, sx, sy)
    @parallax_name = name
    @parallax_x = 0 if @parallax_loop_x && !loop_x
    @parallax_y = 0 if @parallax_loop_y && !loop_y
    @parallax_loop_x = loop_x
    @parallax_loop_y = loop_y
    @parallax_sx = sx
    @parallax_sy = sy
  }
  //--------------------------------------------------------------------------
  // ● インタプリタの更新
  //--------------------------------------------------------------------------
  public update_interpreter
    loop do
      @interpreter.update
      return if @interpreter.running?
      if @interpreter.event_id > 0
        unlock_event(@interpreter.event_id)
        @interpreter.clear
      }
      return unless setup_starting_event
    }
  }
  //--------------------------------------------------------------------------
  // ● イベントのロック解除
  //--------------------------------------------------------------------------
  public unlock_event(event_id)
    @events[event_id].unlock if @events[event_id]
  }
  //--------------------------------------------------------------------------
  // ● 起動中イベントのセットアップ
  //--------------------------------------------------------------------------
  public setup_starting_event
    refresh if @need_refresh
    return true if @interpreter.setup_reserved_common_event
    return true if setup_starting_map_event
    return true if setup_autorun_common_event
    return false
  }
  //--------------------------------------------------------------------------
  // ● 起動中マップイベントの存在判定
  //--------------------------------------------------------------------------
  public any_event_starting?
    @events.values.any? {|event| event.starting }
  }
  //--------------------------------------------------------------------------
  // ● 起動中のマップイベントを検出／セットアップ
  //--------------------------------------------------------------------------
  public setup_starting_map_event
    event = @events.values.find {|event| event.starting }
    event.clear_starting_flag if event
    @interpreter.setup(event.list, event.id) if event
    event
  }
  //--------------------------------------------------------------------------
  // ● 自動実行のコモンイベントを検出／セットアップ
  //--------------------------------------------------------------------------
  public setup_autorun_common_event
    event = $data_common_events.find do |event|
      event && event.autorun? && $game_switches[event.switch_id]
    }
    @interpreter.setup(event.list) if event
    event
  }
}
