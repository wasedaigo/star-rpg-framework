require "mini_rpg_lib"
require "mini_rpg1/config"

module MiniRPG1
  module PlayScene
    class View
      def render_clock_control(model, s)
        if model.global_model.variables[12] >= 0
          model.buffer.render_texture(model.texture_manager.get_texture("system/clock/cancel"), 165, 220)
          
          v = model.player.screen_x- 8
          v -= 8 if v > 208
          v += 24 if v <= 0
          
          if model.global_model.switches[1]
            model.buffer.render_texture(model.texture_manager.get_texture("system/clock/left_stop"), v - 8, model.player.screen_y - 8)
          else
            t = model.global_model.variables[12] == 0 ? "_down" : ""
            model.buffer.render_texture(model.texture_manager.get_texture("system/clock/left" + t), v - 8, model.player.screen_y - 8)
          end

          t = model.global_model.variables[12] == 1 ? "_down" : ""
          model.buffer.render_texture(model.texture_manager.get_texture("system/clock/stop" + t), v + 8, model.player.screen_y - 8)
          
          if model.global_model.switches[2]
            model.buffer.render_texture(model.texture_manager.get_texture("system/clock/right_stop"), v + 24, model.player.screen_y - 8)
          else
            t = model.global_model.variables[12] == 2 ? "_down" : ""
            model.buffer.render_texture(model.texture_manager.get_texture("system/clock/right" + t), v + 24, model.player.screen_y - 8)
          end
        else
          if !model.player.pause
            model.buffer.render_texture(model.texture_manager.get_texture("system/clock/use_clock"), 165, 220)
          end
        end
      end
    
      def render_characters(model, s, layer_no)
        model.character_list.select{|item|item.layer == layer_no}.sort_by{|v|v.y}.each do |obj|
          obj.render(model.buffer, -model.map.base_x, -model.map.base_y)
        end
      end
      
      def render_panorama(model, s)
        if model.panorama
          model.panorama.render(model.buffer)
        else
          model.buffer.fill(Color.new(0, 0, 0, 255))
        end
      end
      
      def update(model, s)
        self.render_panorama(model, s)
        
        model.map.render(model.buffer, 0)

        self.render_characters(model, s, 0)
        self.render_characters(model, s, 1)
        
        model.map.render(model.buffer, 1)
        
        self.render_characters(model, s, 2)
        self.render_clock_control(model, s)
        
        s.render_texture(model.buffer, 0, Config::MAP_DELTA_Y, :blend_type => :none, :tone_red => model.global_model.screen_red, :tone_green => model.global_model.screen_green, :tone_blue => model.global_model.screen_blue)
        model.window_manager.render(s, 0, Config::MAP_DELTA_Y)
      end
    end
  end
end
