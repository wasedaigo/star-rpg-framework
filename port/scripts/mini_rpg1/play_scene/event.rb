require "mini_rpg1/play_scene/event_parameters"
module MiniRPG1
  module PlayScene
    class Event
      include DGO::Interval
      
      attr_reader :character, :pause_movement, :self_switches, :event_pages, :id
      attr_accessor :route, :route_index, :parameters, :vx, :vy, :move_count, :pause_command, :move_runner
      attr_accessor :auto
      #
      # * Initialize Hash
      #
      def initialize(id, model, character)
        @vx = 0
        @vy = 0
        @id = id
        @model = model
        @character = character
        @event_pages = []
        @current_event_page = nil

        @self_switches = Array.new(5){false}
        @move_count = 0
        @pause_command = false
        @move_runner = IntervalRunner.new

        @auto = false
        
        self.reset
      end
      #
      # * Get Event from no
      #     
      def get_event(no)
        no == -1 ? self : @model.get_event_by_id(no)
      end
      #
      # * Get Chracter from no
      #     
      def get_character(no)
        self.get_event(no).character
      end
      #
      # * Return character objectof player
      #
      def player
        return @model.get_character(0)
      end
      #
      # * Return event of player
      #
      def player_event
        return @model.get_event(0)
      end
      #
      # * Condition
      #
      def condition_valid?(condition)
        b = true
        case condition[0]
        when 'variable'
          v1 = @model.global_model.variables[condition[1].to_i]
          case condition[3]
            when 'var'
              v2 = @model.global_model.variables[condition[4].to_i]
            when 'val'
              v2 = condition[4].to_i
          end

          case condition[2]
            when '>'
              b = false unless v1 > v2
            when '>='
              b = false unless v1 >= v2
            when '=='
              b = false unless v1 == v2
            when '<='
              b = false unless v1 <= v2
            when '<'
              b = false unless v1 < v2
          end
        when 'switch'
          if condition[2] == 'on'
            b = false unless @model.global_model.switches[condition[1]]
          else
            b = false if @model.global_model.switches[condition[1]]
          end
          #p "num #{condition[1]} : #{@model.global_model.switches[condition[1]]} b: #{b}"
        when 'self_switch'
          if condition[2] == 'on'
            b = false unless self.self_switches[condition[1]]
          else
            b = false if self.self_switches[condition[1]]
          end
        when 'dir'
          target_character = self.get_character(condition[1].to_i)
          b = false if condition[2].to_i != target_character.dir
        end
        return b
      end
      #
      # * Add newEvent Page
      #
      def <<(page)
        @event_pages << page
      end
      # Pause Event Movement
      def pause_movement=(value)
        @vx, @vy = 0, 0 if value
        @pause_movement = value
      end
      def move(tx, ty)
        @move_count -= 1
        if @move_count < 0
          self.character.dir_x = tx
          self.character.dir_y = ty
          @move_count = 0
          self.next_movement
        else
          @vx, @vy = tx, ty if @vx == 0 && @vy == 0
          b = self.character.set_movement(@vx, @vy, :after_interval => Wait.new(@parameters.wait))
          if b
            self.next_movement if @move_count == 0
          else
            self.next_movement if @parameters.route_skip
          end
        end
      end
       #
      # * Set switch
      #     
      def set_switch(no,  type)
        if type == "reverse"
          @model.global_model.switches[no] = !@model.global_model.switches[no]
        else
          @model.global_model.switches[no] = (type == 'on')
        end
      end
      #
      # * Execute movement
      #     character : character object
      #     @model : @model 
      #
      def execute_movement
        @move_runner.update unless @move_runner.done?
        #p "#{self} #{@pause_movement} #{self.character.running?}  #{self.movement.nil?} #{@route_index} #{@route}"
        return if @pause_movement || self.character.running? || self.movement.nil?

        movement = self.movement
        
        case movement[0]
          when 'move'
            count = movement[2].to_i
            
            if count > 0 && @move_count == 0
              @move_count = count
            end
            case movement[1]
              when 'up'
                self.move(0, -1)
              when 'down'
                self.move(0, 1)
              when 'right'
                self.move(1, 0)
              when 'left'
                self.move(-1, 0)
              when 'upper_left'
                self.move(-1, -1)
              when 'upper_right'
                self.move(1, -1)
              when 'bottom_left'
                self.move(-1, 1)
              when 'bottom_right'
                self.move(1, 1)
              when 'to'
                self.character.face_to(@model.player)
                tx, ty = self.character.dir_x, self.character.dir_y
                self.move(tx, ty)
              when 'against'
                self.character.face_to(@model.player)
                tx, ty = self.character.dir_x, self.character.dir_y
                tx *= -1
                ty *= -1
                self.move(tx, ty)
              when 'random'
                tx, ty = self.character.devide_dir(rand(4))
                self.move(tx, ty)
              when 'forward'
                tx, ty = self.character.dir_x, self.character.dir_y
                self.move(tx, ty)
              when 'backward'
                tx, ty = self.character.dir_x, self.character.dir_y
                tx *= -1
                ty *= -1
                self.move(tx, ty) 
            end
            when 'play_se'
                 if movement[1] == ""
                  Audio.stop_all_ses
                 else
                  Audio.play_se("sounds/se/" + movement[1])
                 end
                 self.next_movement
            when 'switch'
              case movement[1]
              when 'single'
                self.set_switch(movement[2].to_i, movement[3])
              when 'area'
                (movement[2].to_i..movement[3].to_i).each do |no|
                self.set_switch(no, movement[4])
              end
            end
            self.next_movement
          when 'anime'
           self.character.move_anime = movement[1]
           self.character.stay_anime = movement[2]
           self.next_movement
          when 'pass'
           self.character.pass_tile = movement[1]
           self.character.pass_character = movement[2]
           self.character.pass_event = movement[3]
           self.next_movement
          when 'wait'
           self.character.set_wait(movement[1])
           self.next_movement
          when 'visible'
           self.character.visible = true
           self.next_movement
          when 'invisible'
           self.character.visible = false
           self.next_movement
          when 'dir_fix'
           self.character.dir_fix = true
           self.next_movement
          when 'dir_free'
           self.character.dir_fix = false
           self.next_movement
          when 'set_speed'
           self.character.speed_type = movement[1]
           self.next_movement
          when 'speed_up'
           self.character.speed_type += 1
           self.next_movement
          when 'speed_down'
           self.character.speed_type -= 1
           self.next_movement
          when 'set_graphic'
           self.set_character_chip(@model, movement[1], movement[2], movement[3])
           self.next_movement
        end
      end
      #
      # *Reset event state
      #
      def reset
        @parameters = EventParameters.new

        @pause_movement = false
        @route = []
        @route_index = 0

        @save_route = []
        @save_route_index = -1
        @save_pause_movement = false
        @save_route_repeat = false
        @save_route_skip = false
      end
      #
      # * Return current movement command
      #
      def set_init_route(route)
        @route = route.clone
        @pause_movement = false
        @save_route = route.clone
        @save_route_index = -1
        @save_pause_movement = @pause_movement
        @save_route_repeat = @parameters.route_repeat
        @save_route_skip = @parameters.route_skip
      end
      #
      # * Keep current route index and pause condition
      #
      def save_route
        @save_route_index = @route_index if @save_route_index == -1
        @save_pause_movement = @pause_movement
      end
      #
      # * Return current movement command
      #
      def reset_route
        @route = @save_route.clone
        @route_index = @save_route_index if @save_route_index >= 0
        @save_route_index = -1
        @pause_movement = @save_pause_movement
        @parameters.route_repeat = @save_route_repeat
        @parameters.route_skip = @save_route_skip
      end     
      #
      # * Return current movement command
      #
      def movement
        return @route[@route_index]
      end
      #  
      #     move to next movement
      #
      def next_movement
        @move_count = 0
        @vx = 0
        @vy = 0
        @route_index += 1
        if @parameters.route_repeat
          if @route_index >= @route.length
            @route_index = 0
          end
        end
      end
      #set character chip
      def set_character_chip(model, chipset_id, sx, sy)
        chipset = model.get_character_chipset(chipset_id)
        
        if chipset
          @character.set_dir(sy % chipset.dir_number)
          @character.frame_no = sx % chipset.animation_frame_number
          @character.set_chip(chipset, (sx / chipset.animation_frame_number).floor, (sy / chipset.dir_number).floor)
        else
          @character.set_chip(nil, 0, 0)
        end
      end
      #
      # * Update Event
      #
      def update(stack)
        return if @event_pages.empty?
        
        # if current page has already been activated, just call it.
        if @current_event_page && @current_event_page.active?
          @current_event_page.execute_command(stack)
          return
        end
        
        @event_pages.reverse.each do |event_page|
          next unless event_page.valid?

          # When the page is changed
          unless @current_event_page == event_page
            event_page.on_validate 
          end

          # First time call the command of the page
          if event_page.trigger? 
            event_page.on_command_start 
            event_page.execute_command(stack)
          end

          @current_event_page = event_page
          return
        end
        
        if @current_event_page
          @current_event_page = nil
          @character.set_chip(nil, 0, 0)
          @character.pass_tile = true
          @character.pass_character = true
          @character.pass_event = true
          self.reset
        end
      end
      #
      # * Move
      #
      def update_movement
        self.execute_movement
      end
    end
  end
end
