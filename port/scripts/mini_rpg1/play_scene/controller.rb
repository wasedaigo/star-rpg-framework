require "./simple_input"
require "mini_rpg1/config"
require "mini_rpg_lib"
require "dgo/tile_map/collision_type"

module MiniRPG1
  module PlayScene
    class Controller
      include DGO::TileMap
      # Caliculate the base render position(Top-Left)     
      def pause
        model.character_list.each {|obj| obj.pause = false}
      end
      
      def resume
        model.character_list.each {|obj| obj.pause = true}
      end
      
      def check_object(model, obj, tx, ty)
        t = model.map.get_object(tx, ty)
        t.checked(obj) if t && t != obj
      end
      
      def reset_clock_switches(model)
        (21..23).each do |idx|
          model.global_model.switches[idx] = false
        end
      end
      
      def clock_toggle(model)
        if SimpleInput.pressed_newly?(:x)
          model.player.pause = true
          model.global_model.variables[12] = 1
          Audio.play_se("sounds/se/cloth")
          model.get_event(0).set_character_chip(model, 'Ghost', 4, 1)
        end
      end
      
      def clock_control(model)
        return if model.player.running?
        
        if model.player.pause
          var = model.global_model.variables[12]
          if var >= 0
            if SimpleInput.pressed_newly?(:x)
              self.reset_clock_switches(model)
              model.global_model.switches[21 + var] = true
              Audio.play_se("sounds/se/switch")
              if var == 1
                model.get_event(0).set_character_chip(model, 'Ghost', 1, 1) 
                model.player.pause = false
              end
              var = -1
            else
              t = var
              var -= 1 if SimpleInput.pressed_newly?(:left)
              var += 1 if SimpleInput.pressed_newly?(:right)
              s = 0
              e = 2
              s = 1 if model.global_model.switches[1]
              e = 1 if model.global_model.switches[2]
              var = [[var, s].max, e].min

              Audio.play_se("sounds/se/switch") if t != var
            end
          end
          model.global_model.variables[12] = var
        else
          self.clock_toggle(model) 
        end
      end
      
      def update_base(model)
        x = model.player.x
        y = model.player.y
        tx = x - model.map.grid_width * ((model.show_width / 2) / model.map.grid_width)
        ty = y - model.map.grid_height * ((model.show_height / 2) / model.map.grid_height)

        tx = 0 if tx < 0
        ty = 0 if ty < 0

        if tx >= model.map.width - model.show_width
          tx = model.map.width - model.show_width
        end
        if ty >= model.map.height - model.show_height
          ty = model.map.height - model.show_height
        end

        model.map.base_x = tx
        model.map.base_y = ty
      end
      
      def update_tasks(model)
        model.tasks.each do |runner|
          runner.update unless runner.done?
        end
        model.tasks.reject! do |runner|
          runner.done?
        end
      end
      
      def reset(model)
        model.map.reset_object_collisions
        model.map.reset_objects
        model.character_list.each do |obj|
          obj.reset
          # take care collisions of objects which occupies more than one grid
          (0..(obj.hit_x - 1)).each do |i|
            (0..(obj.hit_y - 1)).each do |j|
              model.map.set_object(obj.map_x + i, obj.map_y - j, obj)
              model.map.set_object_collision(obj.map_x + i, obj.map_y - j, CollisionType::ALL)
            end
          end
        end
      end
      
      def update_player(model)
        unless model.player.pause
          obj = model.player
          if !obj.running? && SimpleInput.pressed_newly?(:ok)
            self.check_object(model, obj, obj.map_x, obj.map_y)
            self.check_object(model, obj, obj.map_x + obj.dir_x, obj.map_y + obj.dir_y)
          end
        end
      end
      
      def update_events(model, stack)
        model.events.each{|event|event.update_movement}
        model.events.each{|event|event.update(stack)} if model.global_model.variables[12] == -1
      end
      
      def update_characters(model)
        model.character_list.each_with_index {|character, i| character.update}
      end
      
      def update_player_input(model)
        keys = [:up, :down, :left, :right].select{|key| SimpleInput.pressed?(key)}
        model.player.input_keys(keys)
      end
      
      def update(model, stack, scene)  
        self.update_tasks(model)
        self.reset(model)
        self.clock_control(model)
        self.update_player(model)
        self.update_characters(model)
        self.update_events(model, stack) # order of this effects movement
        self.update_player_input(model)
        self.update_base(model)
        
        model.map.update(model.layers)
        model.window_manager.update(model.map.base_x, model.map.base_y)
      end
    end
  end
end
