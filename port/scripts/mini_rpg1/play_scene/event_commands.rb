require "mini_rpg1/play_scene/window_manager"
require "mini_rpg1/ending_scene/scene"
require "dgo/interval"
module MiniRPG1
  module PlayScene
    class EventCommands
      include DGO::Interval
      attr_reader :commands, :active
      def initialize(root, event, commands, model)
        @model = model
        @root_event = root
        @event = event
        @event_runner = IntervalRunner.new
        self.reset
        @commands = commands
      end
      
      def empty?
        return @commands.empty?
      end
      
      def update(scene_stack, command_stack)
        unless @event_runner.done?
          @event_runner.update 
          return
        end

        return if self.command.nil? || @event.pause_command

        while @active
          @event.pause_command = true
          case self.command[0]
            when 'if'
              self.parse_if(self.command[1], self.command[2])
            when 'call_event_page'
              t = @event.get_event(self.command[1].to_i)
              command_stack << EventCommands.new(@root, t, t.event_pages[self.command[2]].commands, @model)
              self.next_command
              break
            when 'color_change'
              self.color_change(self.command[1].to_i, self.command[2].to_i, self.command[3].to_i, self.command[4].to_i, self.command[5])
              self.next_command
              break
            when 'route' 
              self.set_route(self.command[1].to_i, self.command[2], self.command[3], self.command[4], self.command[5])
              break

            when 'message'
              self.show_message(self.command[1], self.command[2].to_i, self.command[3], self.command[4].to_i)
              break
            when 'self_switch'
              @event.self_switches[self.command[1]] = (self.command[2] == 'on')
              self.next_command
            when 'switch'
              case self.command[1]
              when 'single'
               @event.set_switch(self.command[2].to_i, self.command[3])
              when 'area'
               (self.command[2].to_i..self.command[3].to_i).each do |no|
                @event.set_switch(no, self.command[4])
               end
              end
              self.next_command
            when 'variable'
              self.calculate_variable(self.command[1].to_i, self.command[2], self.command[3], self.command[4].to_i)
              self.next_command
              break
            when 'move_map'
             scene_stack.pop
             scene_stack.push MiniRPG1::PlayScene::Scene.new(@model.global_model, {'player' => @event.player, 'map_id' => command[1], 'start_x' => command[2].to_i, 'start_y' => command[3].to_i})
             break
            when 'move_scene'
             scene_stack.pop
             if self.command[1] == "ending"
              scene_stack.push(MiniRPG1::EndingScene::Scene.new(@model.global_model))
             end
             break
            when 'wait'
             self.set_wait(self.command[1])
             self.next_command
             break
            when 'pause' 
              self.pause(self.command[1].to_i, self.command[2])
              self.next_command
              break
            when 'play_bgm'
             if self.command[1] == ""
              Audio.stop_bgm
             else
              Audio.play_bgm("sounds/bgm/#{self.command[1]}", :loop => true)
             end
             self.next_command
             break
            when 'play_se'
             if self.command[1] == ""
              Audio.stop_all_ses
             else
              Audio.play_se("sounds/se/" + self.command[1])
             end
             self.next_command
             break
            when 'goto'
              self.goto_label(self.command[1])
            when 'else'
              self.goto_next_block('end')
              self.next_command
            when 'end'
              self.next_command
            else
              self.next_command # Skip the other commands
          end
        end
      end
      
      #
      # * Return current command
      #
      def command
        return @commands[@command_index]
      end
      #
      # Color Change
      #
      def color_change(r, g, b, time, wait)
        if time == 0
          @model.global_model.screen_red = r
          @model.global_model.screen_green = g
          @model.global_model.screen_blue = b
        else
          @model.tasks << IntervalRunner.new(
            Parallel.new(
              Lerp.new(time, @model.global_model.screen_red, r){|v| @model.global_model.screen_red = v},
              Lerp.new(time, @model.global_model.screen_green, g){|v| @model.global_model.screen_green = v},
              Lerp.new(time, @model.global_model.screen_blue, b){|v| @model.global_model.screen_blue = v}
            )
          )
        end
        
        # Wait option
        @event_runner.set_interval(Wait.new(time)) if wait
      end
      #
      # Pause Character
      #
      def pause(event_id, value)
        t = @event.get_event(event_id)
        t.pause_command = (value == "on")
        
        # Doesn't change the pause state after the event finished
        @event.auto = false if event_id == 0
      end
      #
      # Set event wait
      #
      def set_wait(wait)
        @event_runner.set_interval(Wait.new(wait))
      end
      #
      # goto next else/end statement
      #
      def goto_next_block(command_type)
        depth = 0
        while @active
          self.next_command
          s = self.command[0]
          break if depth == 0 && s == command_type
          depth += 1 if s== 'if'
          depth -= 1 if depth > 0 && s == 'end'         
        end 
      end
      #
      # goto chosen command
      #
      def goto_label(label_no)
        i = 0
        while @active
          if @commands[i][0] == 'label' && @commands[i][1] == label_no
            @command_index = i
            return
          end
          i += 1
          break if i >= @commands.length
        end
        self.next_command
      end
      #
      # * Parse Condition
      #    
      def parse_if(else_statement, condition)
        unless @event.condition_valid?(condition)
          if else_statement
            self.goto_next_block('else') 
          else
            self.goto_next_block('end') 
          end
        end
        self.next_command
      end

      #
      #* do variable calcularion
      #
      def calculate_variable(index, operator, operand_type, operand)
          case operand_type
            when 'var'
              v = @model.global_model.variables[operand]
            when 'val'
              v = operand
          end
          
          case operator
            when '='
              @model.global_model.variables[index] = v
            when '+'
              @model.global_model.variables[index] += v
            when '-'
              @model.global_model.variables[index] -= v
            when '*'
              @model.global_model.variables[index] *= v
            when '/'
              @model.global_model.variables[index] /= v
            when '%'
              @model.global_model.variables[index] %= v
          end
      end
      #
      # * Show Message
      #     
      def show_message(text, character_id,message_type, auto_close)
        t = @event.get_character(character_id)
        @model.window_manager.push(@model.window_manager.create_window(text, message_type), t) do |obj|
        if auto_close == -1
           if SimpleInput.pressed_newly?(:ok)
              obj[:runner] = IntervalRunner.new(
                Sequence.new(
                  Wait.new(1),
                  Func.new do
                    obj[:finished] = true
                    self.next_command
                  end
                )
              )
           end
          else
            obj[:runner] = IntervalRunner.new(
              Sequence.new(
                Wait.new(1 + auto_close),
                Func.new do
                  obj[:finished] = true
                  self.next_command
                end
              )
            )
          end
        end
      end
      #
      # * Set route
      #   
      def set_route(character_id, route_skip, route_repeat, wait, route)
        target_event = @event.get_event(character_id)
        character = target_event.character

        target_event.save_route
        target_event.parameters.route_repeat = route_repeat
        target_event.parameters.route_skip = route_skip
        target_event.route = route
        target_event.route_index = 0
        target_event.pause_movement = false
        #p "------------"
        #p route
        #p "TARGET:#{target_event} ROUNT: #{route}"
        self.next_command unless wait

        @event.move_runner = IntervalRunner.new(
            Pause.new do
                b = true
                unless target_event.parameters.route_repeat
                  if target_event.route_index >= target_event.route.length && !character.running?
                    target_event.reset_route
                    @event.pause_movement = true
                    self.next_command
                    b = false
                  end
                end
                b
            end
          )
      end
      #  
      #     move to next command
      #
      def next_command
        @event.pause_command = false
        @command_index += 1
        if @command_index >= @commands.length
          @active = false
        end
      end
      #
      # * Reset
      #
      def reset
        @command_index = 0 
        @active = true
      end
    end
  end
end