//==============================================================================
// ■ Game_Screen
//------------------------------------------------------------------------------
// 　色調変更やフラッシュなど、画面全体に関係する処理のデータを保持するクラスで
// す。このクラスは Game_Map クラス、Game_Troop クラスの内部で使用されます。
//==============================================================================

class Game_Screen
  //--------------------------------------------------------------------------
  // ● 公開インスタンス変数
  //--------------------------------------------------------------------------
  attr_reader   :brightness               // 明るさ
  attr_reader   :tone                     // 色調
  attr_reader   :flash_color              // フラッシュ色
  attr_reader   :pictures                 // ピクチャ
  attr_reader   :shake                    // シェイク位置
  attr_reader   :weather_type             // 天候 タイプ
  attr_reader   :weather_power            // 天候 強さ (Float)
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize
    @pictures = Game_Pictures.new
    clear
  }
  //--------------------------------------------------------------------------
  // ● クリア
  //--------------------------------------------------------------------------
  public clear
    clear_fade
    clear_tone
    clear_flash
    clear_shake
    clear_weather
    clear_pictures
  }
  //--------------------------------------------------------------------------
  // ● フェードイン・アウトのクリア
  //--------------------------------------------------------------------------
  public clear_fade
    @brightness = 255
    @fadeout_duration = 0
    @fadein_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● 色調のクリア
  //--------------------------------------------------------------------------
  public clear_tone
    @tone = Tone.new
    @tone_target = Tone.new
    @tone_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● フラッシュのクリア
  //--------------------------------------------------------------------------
  public clear_flash
    @flash_color = Color.new
    @flash_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● シェイクのクリア
  //--------------------------------------------------------------------------
  public clear_shake
    @shake_power = 0
    @shake_speed = 0
    @shake_duration = 0
    @shake_direction = 1
    @shake = 0
  }
  //--------------------------------------------------------------------------
  // ● 天候のクリア
  //--------------------------------------------------------------------------
  public clear_weather
    @weather_type = :none
    @weather_power = 0
    @weather_power_target = 0
    @weather_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● ピクチャのクリア
  //--------------------------------------------------------------------------
  public clear_pictures
    @pictures.each {|picture| picture.erase }
  }
  //--------------------------------------------------------------------------
  // ● フェードアウトの開始
  //--------------------------------------------------------------------------
  public start_fadeout(duration)
    @fadeout_duration = duration
    @fadein_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● フェードインの開始
  //--------------------------------------------------------------------------
  public start_fadein(duration)
    @fadein_duration = duration
    @fadeout_duration = 0
  }
  //--------------------------------------------------------------------------
  // ● 色調変更の開始
  //--------------------------------------------------------------------------
  public start_tone_change(tone, duration)
    @tone_target = tone.clone
    @tone_duration = duration
    @tone = @tone_target.clone if @tone_duration == 0
  }
  //--------------------------------------------------------------------------
  // ● フラッシュの開始
  //--------------------------------------------------------------------------
  public start_flash(color, duration)
    @flash_color = color.clone
    @flash_duration = duration
  }
  //--------------------------------------------------------------------------
  // ● シェイクの開始
  //     power : 強さ
  //     speed : 速さ
  //--------------------------------------------------------------------------
  public start_shake(power, speed, duration)
    @shake_power = power
    @shake_speed = speed
    @shake_duration = duration
  }
  //--------------------------------------------------------------------------
  // ● 天候の変更
  //     type  : タイプ (:none, :rain, :storm, :snow)
  //     power : 強さ
  //    雨が段階的に止むような表現を行うため、天候タイプがなし (:none) の場合
  //    は例外的に @weather_power_target (強さの目標値) を 0 に設定する。
  //--------------------------------------------------------------------------
  public change_weather(type, power, duration)
    @weather_type = type if type != :none || duration == 0
    @weather_power_target = type == :none ? 0.0 : power.to_f
    @weather_duration = duration
    @weather_power = @weather_power_target if duration == 0
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    update_fadeout
    update_fadein
    update_tone
    update_flash
    update_shake
    update_weather
    update_pictures
  }
  //--------------------------------------------------------------------------
  // ● フェードアウトの更新
  //--------------------------------------------------------------------------
  public update_fadeout
    if @fadeout_duration > 0
      d = @fadeout_duration
      @brightness = (@brightness * (d - 1)) / d
      @fadeout_duration -= 1
    }
  }
  //--------------------------------------------------------------------------
  // ● フェードインの更新
  //--------------------------------------------------------------------------
  public update_fadein
    if @fadein_duration > 0
      d = @fadein_duration
      @brightness = (@brightness * (d - 1) + 255) / d
      @fadein_duration -= 1
    }
  }
  //--------------------------------------------------------------------------
  // ● 色調の更新
  //--------------------------------------------------------------------------
  public update_tone
    if @tone_duration > 0
      d = @tone_duration
      @tone.red = (@tone.red * (d - 1) + @tone_target.red) / d
      @tone.green = (@tone.green * (d - 1) + @tone_target.green) / d
      @tone.blue = (@tone.blue * (d - 1) + @tone_target.blue) / d
      @tone.gray = (@tone.gray * (d - 1) + @tone_target.gray) / d
      @tone_duration -= 1
    }
  }
  //--------------------------------------------------------------------------
  // ● フラッシュの更新
  //--------------------------------------------------------------------------
  public update_flash
    if @flash_duration > 0
      d = @flash_duration
      @flash_color.alpha = @flash_color.alpha * (d - 1) / d
      @flash_duration -= 1
    }
  }
  //--------------------------------------------------------------------------
  // ● シェイクの更新
  //--------------------------------------------------------------------------
  public update_shake
    if @shake_duration > 0 || @shake != 0
      delta = (@shake_power * @shake_speed * @shake_direction) / 10.0
      if @shake_duration <= 1 && @shake * (@shake + delta) < 0
        @shake = 0
      else
        @shake += delta
      }
      @shake_direction = -1 if @shake > @shake_power * 2
      @shake_direction = 1 if @shake < - @shake_power * 2
      @shake_duration -= 1
    }
  }
  //--------------------------------------------------------------------------
  // ● 天候の更新
  //--------------------------------------------------------------------------
  public update_weather
    if @weather_duration > 0
      d = @weather_duration
      @weather_power = (@weather_power * (d - 1) + @weather_power_target) / d
      @weather_duration -= 1
      if @weather_duration == 0 && @weather_power_target == 0
        @weather_type = :none
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● ピクチャの更新
  //--------------------------------------------------------------------------
  public update_pictures
    @pictures.each {|picture| picture.update }
  }
  //--------------------------------------------------------------------------
  // ● フラッシュの開始（毒・ダメージ床用）
  //--------------------------------------------------------------------------
  public start_flash_for_damage
    start_flash(Color.new(255,0,0,128), 8)
  }
}
