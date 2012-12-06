//==============================================================================
// ■ Sprite_Base
//------------------------------------------------------------------------------
// 　アニメーションの表示処理を追加したスプライトのクラスです。
//==============================================================================

class Sprite_Base < Sprite
  //--------------------------------------------------------------------------
  // ● クラス変数
  //--------------------------------------------------------------------------
  @@ani_checker = []
  @@ani_spr_checker = []
  @@_reference_count = {}
  //--------------------------------------------------------------------------
  // ● オブジェクト初期化
  //--------------------------------------------------------------------------
  public initialize(viewport = nil)
    super(viewport)
    @use_sprite = true        // スプライト使用フラグ
    @ani_duration = 0         // アニメーションの残り時間
  }
  //--------------------------------------------------------------------------
  // ● 解放
  //--------------------------------------------------------------------------
  public dispose
    super
    dispose_animation
  }
  //--------------------------------------------------------------------------
  // ● フレーム更新
  //--------------------------------------------------------------------------
  public update
    super
    update_animation
    @@ani_checker.clear
    @@ani_spr_checker.clear
  }
  //--------------------------------------------------------------------------
  // ● アニメーション表示中判定
  //--------------------------------------------------------------------------
  public animation?
    @animation != nil
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの開始
  //--------------------------------------------------------------------------
  public start_animation(animation, mirror = false)
    dispose_animation
    @animation = animation
    if @animation
      @ani_mirror = mirror
      set_animation_rate
      @ani_duration = @animation.frame_max * @ani_rate + 1
      load_animation_bitmap
      make_animation_sprites
      set_animation_origin
    }
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの速度を設定
  //--------------------------------------------------------------------------
  public set_animation_rate
    @ani_rate = 4     // デフォルトでは固定値
  }
  //--------------------------------------------------------------------------
  // ● アニメーション グラフィックの読み込み
  //--------------------------------------------------------------------------
  public load_animation_bitmap
    animation1_name = @animation.animation1_name
    animation1_hue = @animation.animation1_hue
    animation2_name = @animation.animation2_name
    animation2_hue = @animation.animation2_hue
    @ani_bitmap1 = Cache.animation(animation1_name, animation1_hue)
    @ani_bitmap2 = Cache.animation(animation2_name, animation2_hue)
    if @@_reference_count.include?(@ani_bitmap1)
      @@_reference_count[@ani_bitmap1] += 1
    else
      @@_reference_count[@ani_bitmap1] = 1
    }
    if @@_reference_count.include?(@ani_bitmap2)
      @@_reference_count[@ani_bitmap2] += 1
    else
      @@_reference_count[@ani_bitmap2] = 1
    }
    Graphics.frame_reset
  }
  //--------------------------------------------------------------------------
  // ● アニメーションスプライトの作成
  //--------------------------------------------------------------------------
  public make_animation_sprites
    @ani_sprites = []
    if @use_sprite && !@@ani_spr_checker.include?(@animation)
      16.times do
        sprite = ::Sprite.new(viewport)
        sprite.visible = false
        @ani_sprites.push(sprite)
      }
      if @animation.position == 3
        @@ani_spr_checker.push(@animation)
      }
    }
    @ani_duplicated = @@ani_checker.include?(@animation)
    if !@ani_duplicated && @animation.position == 3
      @@ani_checker.push(@animation)
    }
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの原点設定
  //--------------------------------------------------------------------------
  public set_animation_origin
    if @animation.position == 3
      if viewport == nil
        @ani_ox = Graphics.width / 2
        @ani_oy = Graphics.height / 2
      else
        @ani_ox = viewport.rect.width / 2
        @ani_oy = viewport.rect.height / 2
      }
    else
      @ani_ox = x - ox + width / 2
      @ani_oy = y - oy + height / 2
      if @animation.position == 0
        @ani_oy -= height / 2
      elsif @animation.position == 2
        @ani_oy += height / 2
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの解放
  //--------------------------------------------------------------------------
  public dispose_animation
    if @ani_bitmap1
      @@_reference_count[@ani_bitmap1] -= 1
      if @@_reference_count[@ani_bitmap1] == 0
        @ani_bitmap1.dispose
      }
    }
    if @ani_bitmap2
      @@_reference_count[@ani_bitmap2] -= 1
      if @@_reference_count[@ani_bitmap2] == 0
        @ani_bitmap2.dispose
      }
    }
    if @ani_sprites
      @ani_sprites.each {|sprite| sprite.dispose }
      @ani_sprites = nil
      @animation = nil
    }
    @ani_bitmap1 = nil
    @ani_bitmap2 = nil
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの更新
  //--------------------------------------------------------------------------
  public update_animation
    return unless animation?
    @ani_duration -= 1
    if @ani_duration % @ani_rate == 0
      if @ani_duration > 0
        frame_index = @animation.frame_max
        frame_index -= (@ani_duration + @ani_rate - 1) / @ani_rate
        animation_set_sprites(@animation.frames[frame_index])
        @animation.timings.each do |timing|
          animation_process_timing(timing) if timing.frame == frame_index
        }
      else
        end_animation
      }
    }
  }
  //--------------------------------------------------------------------------
  // ● アニメーションの終了
  //--------------------------------------------------------------------------
  public end_animation
    dispose_animation
  }
  //--------------------------------------------------------------------------
  // ● アニメーションスプライトの設定
  //     frame : フレームデータ（RPG::Animation::Frame）
  //--------------------------------------------------------------------------
  public animation_set_sprites(frame)
    cell_data = frame.cell_data
    @ani_sprites.each_with_index do |sprite, i|
      next unless sprite
      pattern = cell_data[i, 0]
      if !pattern || pattern < 0
        sprite.visible = false
        next
      }
      sprite.bitmap = pattern < 100 ? @ani_bitmap1 : @ani_bitmap2
      sprite.visible = true
      sprite.src_rect.set(pattern % 5 * 192,
        pattern % 100 / 5 * 192, 192, 192)
      if @ani_mirror
        sprite.x = @ani_ox - cell_data[i, 1]
        sprite.y = @ani_oy + cell_data[i, 2]
        sprite.angle = (360 - cell_data[i, 4])
        sprite.mirror = (cell_data[i, 5] == 0)
      else
        sprite.x = @ani_ox + cell_data[i, 1]
        sprite.y = @ani_oy + cell_data[i, 2]
        sprite.angle = cell_data[i, 4]
        sprite.mirror = (cell_data[i, 5] == 1)
      }
      sprite.z = self.z + 300 + i
      sprite.ox = 96
      sprite.oy = 96
      sprite.zoom_x = cell_data[i, 3] / 100.0
      sprite.zoom_y = cell_data[i, 3] / 100.0
      sprite.opacity = cell_data[i, 6] * self.opacity / 255.0
      sprite.blend_type = cell_data[i, 7]
    }
  }
  //--------------------------------------------------------------------------
  // ● SE とフラッシュのタイミング処理
  //     timing : タイミングデータ（RPG::Animation::Timing）
  //--------------------------------------------------------------------------
  public animation_process_timing(timing)
    timing.se.play unless @ani_duplicated
    case timing.flash_scope
    when 1
      self.flash(timing.flash_color, timing.flash_duration * @ani_rate)
    when 2
      if viewport && !@ani_duplicated
        viewport.flash(timing.flash_color, timing.flash_duration * @ani_rate)
      }
    when 3
      self.flash(nil, timing.flash_duration * @ani_rate)
    }
  }
}
