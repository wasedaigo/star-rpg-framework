//==============================================================================
// ■ Sprite_Character
//------------------------------------------------------------------------------
// 　キャラクター表示用のスプライトです。Game_Character クラスのインスタンスを
// 監視し、スプライトの状態を自動的に変化させます。
//==============================================================================

class Sprite_Character < Sprite_Base
  //--------------------------------------------------------------------------
  // ● 公開インスタンス変数
  //--------------------------------------------------------------------------
  attr_accessor :character
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //     character : Game_Character
  //--------------------------------------------------------------------------
  public initialize(viewport, character = nil)
    super(viewport)
    @character = character
    @balloon_duration = 0
    update
  }
  //--------------------------------------------------------------------------
  // ● 解放
  //--------------------------------------------------------------------------
  public dispose
    end_animation
    end_balloon
    super
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    super
    update_bitmap
    update_src_rect
    update_position
    update_other
    update_balloon
    setup_new_effect
  }
  //--------------------------------------------------------------------------
  // ● 指定されたタイルが含まれるタイルセット画像の取得
  //--------------------------------------------------------------------------
  public tileset_bitmap(tile_id)
    Cache.tileset($game_map.tileset.tileset_names[5 + tile_id / 256])
  }
  //--------------------------------------------------------------------------
  // ● 転送元ビットマップの更新
  //--------------------------------------------------------------------------
  public update_bitmap
    if graphic_changed?
      @tile_id = @character.tile_id
      @character_name = @character.character_name
      @character_index = @character.character_index
      if @tile_id > 0
        set_tile_bitmap
      else
        set_character_bitmap
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● グラフィックの変更判定
  //--------------------------------------------------------------------------
  public graphic_changed?
    @tile_id != @character.tile_id ||
    @character_name != @character.character_name ||
    @character_index != @character.character_index
  }
  //--------------------------------------------------------------------------
  // ● タイルのビットマップを設定
  //--------------------------------------------------------------------------
  public set_tile_bitmap
    sx = (@tile_id / 128 % 2 * 8 + @tile_id % 8) * 32;
    sy = @tile_id % 256 / 8 % 16 * 32;
    self.bitmap = tileset_bitmap(@tile_id)
    self.src_rect.set(sx, sy, 32, 32)
    self.ox = 16
    self.oy = 32
  }
  //--------------------------------------------------------------------------
  // ● キャラクターのビットマップを設定
  //--------------------------------------------------------------------------
  public set_character_bitmap
    self.bitmap = Cache.character(@character_name)
    sign = @character_name[/^[\!\$]./]
    if sign && sign.include?('$')
      @cw = bitmap.width / 3
      @ch = bitmap.height / 4
    else
      @cw = bitmap.width / 12
      @ch = bitmap.height / 8
    }
    self.ox = @cw / 2
    self.oy = @ch
  }
  //--------------------------------------------------------------------------
  // ● 転送元矩形の更新
  //--------------------------------------------------------------------------
  public update_src_rect
    if @tile_id == 0
      index = @character.character_index
      pattern = @character.pattern < 3 ? @character.pattern : 1
      sx = (index % 4 * 3 + pattern) * @cw
      sy = (index / 4 * 4 + (@character.direction - 2) / 2) * @ch
      self.src_rect.set(sx, sy, @cw, @ch)
    }
  }
  //--------------------------------------------------------------------------
  // ● 位置の更新
  //--------------------------------------------------------------------------
  public update_position
    self.x = @character.screen_x
    self.y = @character.screen_y
    self.z = @character.screen_z
  }
  //--------------------------------------------------------------------------
  // ● その他の更新
  //--------------------------------------------------------------------------
  public update_other
    self.opacity = @character.opacity
    self.blend_type = @character.blend_type
    self.bush_depth = @character.bush_depth
    self.visible = !@character.transparent
  }
  //--------------------------------------------------------------------------
  // ● 新しいエフェクトの設定
  //--------------------------------------------------------------------------
  public setup_new_effect
    if !animation? && @character.animation_id > 0
      animation = $data_animations[@character.animation_id]
      start_animation(animation)
    }
    if !@balloon_sprite && @character.balloon_id > 0
      @balloon_id = @character.balloon_id
      start_balloon
    }
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの終了
  //--------------------------------------------------------------------------
  public end_animation
    super
    @character.animation_id = 0
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコン表示の開始
  //--------------------------------------------------------------------------
  public start_balloon
    dispose_balloon
    @balloon_duration = 8 * balloon_speed + balloon_wait
    @balloon_sprite = ::Sprite.new(viewport)
    @balloon_sprite.bitmap = Cache.system("Balloon")
    @balloon_sprite.ox = 16
    @balloon_sprite.oy = 32
    update_balloon
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコンの解放
  //--------------------------------------------------------------------------
  public dispose_balloon
    if @balloon_sprite
      @balloon_sprite.dispose
      @balloon_sprite = nil
    }
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコンの更新
  //--------------------------------------------------------------------------
  public update_balloon
    if @balloon_duration > 0
      @balloon_duration -= 1
      if @balloon_duration > 0
        @balloon_sprite.x = x
        @balloon_sprite.y = y - height
        @balloon_sprite.z = z + 200
        sx = balloon_frame_index * 32
        sy = (@balloon_id - 1) * 32
        @balloon_sprite.src_rect.set(sx, sy, 32, 32)
      else
        end_balloon
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコンの終了
  //--------------------------------------------------------------------------
  public end_balloon
    dispose_balloon
    @character.balloon_id = 0
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコンの表示速度
  //--------------------------------------------------------------------------
  public balloon_speed
    return 8
  }
  //--------------------------------------------------------------------------
  // ● フキダシ最終フレームのウェイト時間
  //--------------------------------------------------------------------------
  public balloon_wait
    return 12
  }
  //--------------------------------------------------------------------------
  // ● フキダシアイコンのフレーム番号
  //--------------------------------------------------------------------------
  public balloon_frame_index
    return 7 - [(@balloon_duration - balloon_wait) / balloon_speed, 0].max
  }
}
