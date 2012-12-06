//==============================================================================
// ■ DataManager
//------------------------------------------------------------------------------
// 　データベースとゲームオブジェクトを管理するモジュールです。ゲームで使用する
// ほぼ全てのグローバル変数はこのモジュールで初期化されます。
//==============================================================================

class DataManager
  //--------------------------------------------------------------------------
  // ● モジュールのインスタンス変数
  //--------------------------------------------------------------------------
  @last_savefile_index = 0                // 最後にアクセスしたファイル
  //--------------------------------------------------------------------------
  // ● モジュール初期化
  //--------------------------------------------------------------------------
  public init
    @last_savefile_index = 0
    load_database
    create_game_objects
    setup_battle_test if $BTEST
  }
  //--------------------------------------------------------------------------
  // ● データベースのロード
  //--------------------------------------------------------------------------
  public load_database
    if $BTEST
      load_battle_test_database
    else
      load_normal_database
      check_player_location
    }
  }
  //--------------------------------------------------------------------------
  // ● 通常のデータベースをロード
  //--------------------------------------------------------------------------
  public load_normal_database
    $data_actors        = load_data("Data/Actors.rvdata2")
    $data_classes       = load_data("Data/Classes.rvdata2")
    $data_skills        = load_data("Data/Skills.rvdata2")
    $data_items         = load_data("Data/Items.rvdata2")
    $data_weapons       = load_data("Data/Weapons.rvdata2")
    $data_armors        = load_data("Data/Armors.rvdata2")
    $data_enemies       = load_data("Data/Enemies.rvdata2")
    $data_troops        = load_data("Data/Troops.rvdata2")
    $data_states        = load_data("Data/States.rvdata2")
    $data_animations    = load_data("Data/Animations.rvdata2")
    $data_tilesets      = load_data("Data/Tilesets.rvdata2")
    $data_common_events = load_data("Data/CommonEvents.rvdata2")
    $data_system        = load_data("Data/System.rvdata2")
    $data_mapinfos      = load_data("Data/MapInfos.rvdata2")
  }
  //--------------------------------------------------------------------------
  // ● 戦闘テスト用のデータベースをロード
  //--------------------------------------------------------------------------
  public load_battle_test_database
    $data_actors        = load_data("Data/BT_Actors.rvdata2")
    $data_classes       = load_data("Data/BT_Classes.rvdata2")
    $data_skills        = load_data("Data/BT_Skills.rvdata2")
    $data_items         = load_data("Data/BT_Items.rvdata2")
    $data_weapons       = load_data("Data/BT_Weapons.rvdata2")
    $data_armors        = load_data("Data/BT_Armors.rvdata2")
    $data_enemies       = load_data("Data/BT_Enemies.rvdata2")
    $data_troops        = load_data("Data/BT_Troops.rvdata2")
    $data_states        = load_data("Data/BT_States.rvdata2")
    $data_animations    = load_data("Data/BT_Animations.rvdata2")
    $data_tilesets      = load_data("Data/BT_Tilesets.rvdata2")
    $data_common_events = load_data("Data/BT_CommonEvents.rvdata2")
    $data_system        = load_data("Data/BT_System.rvdata2")
  }
  //--------------------------------------------------------------------------
  // ● プレイヤーの初期位置存在チェック
  //--------------------------------------------------------------------------
  public check_player_location
    if $data_system.start_map_id == 0
      msgbox(Vocab::PlayerPosError)
      exit
    }
  }
  //--------------------------------------------------------------------------
  // ● 各種ゲームオブジェクトの作成
  //--------------------------------------------------------------------------
  public create_game_objects
    $game_temp          = Game_Temp.new
    $game_system        = Game_System.new
    $game_timer         = Game_Timer.new
    $game_message       = Game_Message.new
    $game_switches      = Game_Switches.new
    $game_variables     = Game_Variables.new
    $game_self_switches = Game_SelfSwitches.new
    $game_actors        = Game_Actors.new
    $game_party         = Game_Party.new
    $game_troop         = Game_Troop.new
    $game_map           = Game_Map.new
    $game_player        = Game_Player.new
  }
  //--------------------------------------------------------------------------
  // ● ニューゲームのセットアップ
  //--------------------------------------------------------------------------
  public setup_new_game
    create_game_objects
    $game_party.setup_starting_members
    $game_map.setup($data_system.start_map_id)
    $game_player.moveto($data_system.start_x, $data_system.start_y)
    $game_player.refresh
    Graphics.frame_count = 0
  }
  //--------------------------------------------------------------------------
  // ● 戦闘テストのセットアップ
  //--------------------------------------------------------------------------
  public setup_battle_test
    $game_party.setup_battle_test
    BattleManager.setup($data_system.test_troop_id)
    BattleManager.play_battle_bgm
  }
  //--------------------------------------------------------------------------
  // ● セーブファイルの存在判定
  //--------------------------------------------------------------------------
  public save_file_exists?
    !Dir.glob('Save*.rvdata2').empty?
  }
  //--------------------------------------------------------------------------
  // ● セーブファイルの最大数
  //--------------------------------------------------------------------------
  public savefile_max
    return 16
  }
  //--------------------------------------------------------------------------
  // ● ファイル名の作成
  //     index : ファイルインデックス
  //--------------------------------------------------------------------------
  public make_filename(index)
    sprintf("Save%02d.rvdata2", index + 1)
  }
  //--------------------------------------------------------------------------
  // ● セーブの実行
  //--------------------------------------------------------------------------
  public save_game(index)
    begin
      save_game_without_rescue(index)
    rescue
      delete_save_file(index)
      false
    }
  }
  //--------------------------------------------------------------------------
  // ● ロードの実行
  //--------------------------------------------------------------------------
  public load_game(index)
    load_game_without_rescue(index) rescue false
  }
  //--------------------------------------------------------------------------
  // ● セーブヘッダのロード
  //--------------------------------------------------------------------------
  public load_header(index)
    load_header_without_rescue(index) rescue nil
  }
  //--------------------------------------------------------------------------
  // ● セーブの実行（例外処理なし）
  //--------------------------------------------------------------------------
  public save_game_without_rescue(index)
    File.open(make_filename(index), "wb") do |file|
      $game_system.on_before_save
      Marshal.dump(make_save_header, file)
      Marshal.dump(make_save_contents, file)
      @last_savefile_index = index
    }
    return true
  }
  //--------------------------------------------------------------------------
  // ● ロードの実行（例外処理なし）
  //--------------------------------------------------------------------------
  public load_game_without_rescue(index)
    File.open(make_filename(index), "rb") do |file|
      Marshal.load(file)
      extract_save_contents(Marshal.load(file))
      reload_map_if_updated
      @last_savefile_index = index
    }
    return true
  }
  //--------------------------------------------------------------------------
  // ● セーブヘッダのロード（例外処理なし）
  //--------------------------------------------------------------------------
  public load_header_without_rescue(index)
    File.open(make_filename(index), "rb") do |file|
      return Marshal.load(file)
    }
    return nil
  }
  //--------------------------------------------------------------------------
  // ● セーブファイルの削除
  //--------------------------------------------------------------------------
  public delete_save_file(index)
    File.delete(make_filename(index)) rescue nil
  }
  //--------------------------------------------------------------------------
  // ● セーブヘッダの作成
  //--------------------------------------------------------------------------
  public make_save_header
    header = {}
    header[:characters] = $game_party.characters_for_savefile
    header[:playtime_s] = $game_system.playtime_s
    header
  }
  //--------------------------------------------------------------------------
  // ● セーブ内容の作成
  //--------------------------------------------------------------------------
  public make_save_contents
    contents = {}
    contents[:system]        = $game_system
    contents[:timer]         = $game_timer
    contents[:message]       = $game_message
    contents[:switches]      = $game_switches
    contents[:variables]     = $game_variables
    contents[:self_switches] = $game_self_switches
    contents[:actors]        = $game_actors
    contents[:party]         = $game_party
    contents[:troop]         = $game_troop
    contents[:map]           = $game_map
    contents[:player]        = $game_player
    contents
  }
  //--------------------------------------------------------------------------
  // ● セーブ内容の展開
  //--------------------------------------------------------------------------
  public extract_save_contents(contents)
    $game_system        = contents[:system]
    $game_timer         = contents[:timer]
    $game_message       = contents[:message]
    $game_switches      = contents[:switches]
    $game_variables     = contents[:variables]
    $game_self_switches = contents[:self_switches]
    $game_actors        = contents[:actors]
    $game_party         = contents[:party]
    $game_troop         = contents[:troop]
    $game_map           = contents[:map]
    $game_player        = contents[:player]
  }
  //--------------------------------------------------------------------------
  // ● データが更新されている場合はマップを再読み込み
  //--------------------------------------------------------------------------
  public reload_map_if_updated
    if $game_system.version_id != $data_system.version_id
      $game_map.setup($game_map.map_id)
      $game_player.center($game_player.x, $game_player.y)
      $game_player.make_encounter_count
    }
  }
  //--------------------------------------------------------------------------
  // ● セーブファイルの更新日時を取得
  //--------------------------------------------------------------------------
  public savefile_time_stamp(index)
    File.mtime(make_filename(index)) rescue Time.at(0)
  }
  //--------------------------------------------------------------------------
  // ● 更新日時が最新のファイルインデックスを取得
  //--------------------------------------------------------------------------
  public latest_savefile_index
    savefile_max.times.max_by {|i| savefile_time_stamp(i) }
  }
  //--------------------------------------------------------------------------
  // ● 最後にアクセスしたファイルのインデックスを取得
  //--------------------------------------------------------------------------
  public last_savefile_index
    @last_savefile_index
  }
}
