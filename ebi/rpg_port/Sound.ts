//==============================================================================
// ■ Sound
//------------------------------------------------------------------------------
// 　効果音を演奏するモジュールです。グローバル変数 $data_system からデータベー
// スで設定された SE の内容を取得し、演奏します。
//==============================================================================

module Sound

  // システム効果音
  public play_system_sound(n) {
    $data_system.sounds[n].play
  }

  // カーソル移動
  public play_cursor
    play_system_sound(0)
  }

  // 決定
  public play_ok
    play_system_sound(1)
  }

  // キャンセル
  public play_cancel
    play_system_sound(2)
  }

  // ブザー
  public play_buzzer
    play_system_sound(3)
  }

  // 装備
  public play_equip
    play_system_sound(4)
  }

  // セーブ
  public play_save
    play_system_sound(5)
  }

  // ロード
  public play_load
    play_system_sound(6)
  }

  // 戦闘開始
  public play_battle_start
    play_system_sound(7)
  }

  // 逃走
  public play_escape
    play_system_sound(8)
  }

  // 敵の通常攻撃
  public play_enemy_attack
    play_system_sound(9)
  }

  // 敵ダメージ
  public play_enemy_damage
    play_system_sound(10)
  }

  // 敵消滅
  public play_enemy_collapse
    play_system_sound(11)
  }

  // ボス消滅 1
  public play_boss_collapse1
    play_system_sound(12)
  }

  // ボス消滅 2
  public play_boss_collapse2
    play_system_sound(13)
  }

  // 味方ダメージ
  public play_actor_damage
    play_system_sound(14)
  }

  // 味方戦闘不能
  public play_actor_collapse
    play_system_sound(15)
  }

  // 回復
  public play_recovery
    play_system_sound(16)
  }

  // ミス
  public play_miss
    play_system_sound(17)
  }

  // 攻撃回避
  public play_evasion
    play_system_sound(18)
  }

  // 魔法回避
  public play_magic_evasion
    play_system_sound(19)
  }

  // 魔法反射
  public play_reflection
    play_system_sound(20)
  }

  // ショップ
  public play_shop
    play_system_sound(21)
  }

  // アイテム使用
  public play_use_item
    play_system_sound(22)
  }

  // スキル使用
  public play_use_skill
    play_system_sound(23)
  }

}
