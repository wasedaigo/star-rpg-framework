require "mini_rpg1/play_scene/event_commands"
require "mini_rpg1/play_scene/window_manager"
require "dgo/interval"
module MiniRPG1
  module PlayScene
    class EventPage
      include DGO::Interval
      attr_reader :event_character, :commands
      attr_reader :active
      #
      # * Initialize Hash
      #
      def initialize(event, model, triggers, valid_conditions, commands, route, init_parameters)
        @event = event
        @init_parameters = init_parameters
        @commands = commands
        @command_index = 0
        @original_route = route

        @triggers = triggers
        @valid_conditions = valid_conditions
        @active = false
        
        @model = model
        
        @command_stack = []
        @event_commands = EventCommands.new(event, event, commands, model)
      end

      #
      # * Check whether valid conditions are met.
      #
      def valid?
        b = true
        @valid_conditions.each do |valid_condition|
          b = false unless @event.condition_valid?(valid_condition)
        end
        return b
      end

      #
      # * Check whether triggers' conditions are met.
      #
      def trigger?
        return false if @event_commands.empty?
        b = true
        @event.auto = true
        @triggers.each do |trigger|
          case trigger[0]
          when 'checked'
            b = @event.character.checked?(@event.get_character(trigger[1]))
          when 'touched'
            b = @event.character.touched?(@event.get_character(trigger[1]))
          when 'touch'
            b = @event.get_character(trigger[1]).touched?(@event.character)
          when 'parallel'
            @event.auto = false
            b = true
          when 'auto'
            b = true
          when 'never'
            b = false
          end
        end
        return b
      end
      #
      # * Check whether this event_pageis running 
      #
      def active?
        return @active
      end

       #
      # * Execute command
      #
      def execute_command(scene_stack)
        if @command_stack.empty?
          @event_commands.update(scene_stack, @command_stack) if @event_commands.active
        else
          t = @command_stack.last
          if t.active
            t.update(scene_stack, @command_stack)
          else
            @command_stack.pop
          end
        end
        
        if @command_stack.empty? && !@event_commands.active
          self.on_command_finish
        end
      end
      
     #
      # * On Validate
      #     
      def on_validate
        @event.character.pass_tile = @init_parameters.pass_tile
        @event.character.pass_character = @init_parameters.pass_character
        @event.character.pass_event = @init_parameters.pass_event
        @event.character.dir_fix = @init_parameters.dir_fix
        @event.character.stay_anime = @init_parameters.stay_anime
        @event.character.move_anime = @init_parameters.move_anime
        @event.character.hit_x = @init_parameters.hit_x
        @event.character.hit_y = @init_parameters.hit_y
        @event.character.offset_x = @init_parameters.offset_x
        @event.character.offset_y = @init_parameters.offset_y
        @event.move_count = 0
        
        @event.character.reset_position
        @event.reset
        @event.parameters = @init_parameters.clone
        @event.set_init_route(@original_route)

        @event.set_character_chip(@model, @event.parameters.chip_id, @event.parameters.frame_no, @event.parameters.dir)

        @event.character.speed_type = @event.parameters.speed_type
        @event.character.alpha = @event.parameters.alpha
        @event.character.layer = @event.parameters.layer
        #@event.character.visible = true
      end
      
      #
      # * Start Event
      #     
      def on_command_start
        @active = true
        @event.player.pause = true if @event.auto
        @event.pause_movement = true
      end
      #
      # * Finish Event
      #
      def on_command_finish
        @active = false
        @event.player.pause = false if @event.auto
        @event.pause_movement = false
        @event_commands.reset
      end
    end
  end
end