//==============================================================================
// ■ Spriteset_Map
//------------------------------------------------------------------------------
// 　マップ画面のスプライトやタイルマップなどをまとめたクラスです。このクラスは
// Scene_Map クラスの内部で使用されます。
//==============================================================================

class Spriteset_Map
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize
    create_viewports
    create_tilemap
    create_parallax
    create_characters
    create_shadow
    create_weather
    create_pictures
    create_timer
    update
  }
  //--------------------------------------------------------------------------
  // ● ビューポートの作成
  //--------------------------------------------------------------------------
  public create_viewports
    @viewport1 = Viewport.new
    @viewport2 = Viewport.new
    @viewport3 = Viewport.new
    @viewport2.z = 50
    @viewport3.z = 100
  }
  //--------------------------------------------------------------------------
  // ● タイルマップの作成
  //--------------------------------------------------------------------------
  public create_tilemap
    @tilemap = Tilemap.new(@viewport1)
    @tilemap.map_data = $game_map.data
    load_tileset
  }
  //--------------------------------------------------------------------------
  // ● タイルセットのロード
  //--------------------------------------------------------------------------
  public load_tileset
    @tileset = $game_map.tileset
    @tileset.tileset_names.each_with_index do |name, i|
      @tilemap.bitmaps[i] = Cache.tileset(name)
    }
    @tilemap.flags = @tileset.flags
  }
  //--------------------------------------------------------------------------
  // ● 遠景の作成
  //--------------------------------------------------------------------------
  public create_parallax
    @parallax = Plane.new(@viewport1)
    @parallax.z = -100
  }
  //--------------------------------------------------------------------------
  // ● キャラクタースプライトの作成
  //--------------------------------------------------------------------------
  public create_characters
    @character_sprites = []
    $game_map.events.values.each do |event|
      @character_sprites.push(Sprite_Character.new(@viewport1, event))
    }
    $game_map.vehicles.each do |vehicle|
      @character_sprites.push(Sprite_Character.new(@viewport1, vehicle))
    }
    $game_player.followers.reverse_each do |follower|
      @character_sprites.push(Sprite_Character.new(@viewport1, follower))
    }
    @character_sprites.push(Sprite_Character.new(@viewport1, $game_player))
    @map_id = $game_map.map_id
  }
  //--------------------------------------------------------------------------
  // ● 飛行船の影スプライトの作成
  //--------------------------------------------------------------------------
  public create_shadow
    @shadow_sprite = Sprite.new(@viewport1)
    @shadow_sprite.bitmap = Cache.system("Shadow")
    @shadow_sprite.ox = @shadow_sprite.bitmap.width / 2
    @shadow_sprite.oy = @shadow_sprite.bitmap.height
    @shadow_sprite.z = 180
  }
  //--------------------------------------------------------------------------
  // ● 天候の作成
  //--------------------------------------------------------------------------
  public create_weather
    @weather = Spriteset_Weather.new(@viewport2)
  }
  //--------------------------------------------------------------------------
  // ● ピクチャスプライトの作成
  //--------------------------------------------------------------------------
  public create_pictures
    @picture_sprites = []
  }
  //--------------------------------------------------------------------------
  // ● タイマースプライトの作成
  //--------------------------------------------------------------------------
  public create_timer
    @timer_sprite = Sprite_Timer.new(@viewport2)
  }
  //--------------------------------------------------------------------------
  // ● 解放
  //--------------------------------------------------------------------------
  public dispose
    dispose_tilemap
    dispose_parallax
    dispose_characters
    dispose_shadow
    dispose_weather
    dispose_pictures
    dispose_timer
    dispose_viewports
  }
  //--------------------------------------------------------------------------
  // ● タイルマップの解放
  //--------------------------------------------------------------------------
  public dispose_tilemap
    @tilemap.dispose
  }
  //--------------------------------------------------------------------------
  // ● 遠景の解放
  //--------------------------------------------------------------------------
  public dispose_parallax
    @parallax.bitmap.dispose if @parallax.bitmap
    @parallax.dispose
  }
  //--------------------------------------------------------------------------
  // ● キャラクタースプライトの解放
  //--------------------------------------------------------------------------
  public dispose_characters
    @character_sprites.each {|sprite| sprite.dispose }
  }
  //--------------------------------------------------------------------------
  // ● 飛行船の影スプライトの解放
  //--------------------------------------------------------------------------
  public dispose_shadow
    @shadow_sprite.dispose
  }
  //--------------------------------------------------------------------------
  // ● 天候の解放
  //--------------------------------------------------------------------------
  public dispose_weather
    @weather.dispose
  }
  //--------------------------------------------------------------------------
  // ● ピクチャスプライトの解放
  //--------------------------------------------------------------------------
  public dispose_pictures
    @picture_sprites.compact.each {|sprite| sprite.dispose }
  }
  //--------------------------------------------------------------------------
  // ● タイマースプライトの解放
  //--------------------------------------------------------------------------
  public dispose_timer
    @timer_sprite.dispose
  }
  //--------------------------------------------------------------------------
  // ● ビューポートの解放
  //--------------------------------------------------------------------------
  public dispose_viewports
    @viewport1.dispose
    @viewport2.dispose
    @viewport3.dispose
  }
  //--------------------------------------------------------------------------
  // ● キャラクターのリフレッシュ
  //--------------------------------------------------------------------------
  public refresh_characters
    dispose_characters
    create_characters
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    update_tileset
    update_tilemap
    update_parallax
    update_characters
    update_shadow
    update_weather
    update_pictures
    update_timer
    update_viewports
  }
  //--------------------------------------------------------------------------
  // ● タイルセットの更新
  //--------------------------------------------------------------------------
  public update_tileset
    if @tileset != $game_map.tileset
      load_tileset
      refresh_characters
    }
  }
  //--------------------------------------------------------------------------
  // ● タイルマップの更新
  //--------------------------------------------------------------------------
  public update_tilemap
    @tilemap.map_data = $game_map.data
    @tilemap.ox = $game_map.display_x * 32
    @tilemap.oy = $game_map.display_y * 32
    @tilemap.update
  }
  //--------------------------------------------------------------------------
  // ● 遠景の更新
  //--------------------------------------------------------------------------
  public update_parallax
    if @parallax_name != $game_map.parallax_name
      @parallax_name = $game_map.parallax_name
      @parallax.bitmap.dispose if @parallax.bitmap
      @parallax.bitmap = Cache.parallax(@parallax_name)
      Graphics.frame_reset
    }
    @parallax.ox = $game_map.parallax_ox(@parallax.bitmap)
    @parallax.oy = $game_map.parallax_oy(@parallax.bitmap)
  }
  //--------------------------------------------------------------------------
  // ● キャラクタースプライトの更新
  //--------------------------------------------------------------------------
  public update_characters
    refresh_characters if @map_id != $game_map.map_id
    @character_sprites.each {|sprite| sprite.update }
  }
  //--------------------------------------------------------------------------
  // ● 飛行船の影スプライトの更新
  //--------------------------------------------------------------------------
  public update_shadow
    airship = $game_map.airship
    @shadow_sprite.x = airship.screen_x
    @shadow_sprite.y = airship.screen_y + airship.altitude
    @shadow_sprite.opacity = airship.altitude * 8
    @shadow_sprite.update
  }
  //--------------------------------------------------------------------------
  // ● 天候の更新
  //--------------------------------------------------------------------------
  public update_weather
    @weather.type = $game_map.screen.weather_type
    @weather.power = $game_map.screen.weather_power
    @weather.ox = $game_map.display_x * 32
    @weather.oy = $game_map.display_y * 32
    @weather.update
  }
  //--------------------------------------------------------------------------
  // ● ピクチャスプライトの更新
  //--------------------------------------------------------------------------
  public update_pictures
    $game_map.screen.pictures.each do |pic|
      @picture_sprites[pic.number] ||= Sprite_Picture.new(@viewport2, pic)
      @picture_sprites[pic.number].update
    }
  }
  //--------------------------------------------------------------------------
  // ● タイマースプライトの更新
  //--------------------------------------------------------------------------
  public update_timer
    @timer_sprite.update
  }
  //--------------------------------------------------------------------------
  // ● ビューポートの更新
  //--------------------------------------------------------------------------
  public update_viewports
    @viewport1.tone.set($game_map.screen.tone)
    @viewport1.ox = $game_map.screen.shake
    @viewport2.color.set($game_map.screen.flash_color)
    @viewport3.color.set(0, 0, 0, 255 - $game_map.screen.brightness)
    @viewport1.update
    @viewport2.update
    @viewport3.update
  }
}
