require "mini_rpg1/config"
require "dgo/tile_map/character"
require "dgo/tile_map/map"
require "dgo/tile_map/map_layer"
require "dgo/tile_map/character_speed_type"
require "dgo/tile_map/map_loader"
require "dgo/interval/interval_runner"
require "dgo/interval/lerp"
require "dgo/misc/texture_manager"
require 'find'

require "mini_rpg1/play_scene/event"
require "mini_rpg1/play_scene/event_loader"
require "mini_rpg1/play_scene/window_manager"
require "mini_rpg1/play_scene/event_parameters"

module MiniRPG1
  module PlayScene
    class Model
      include MiniRPG1::Config
      include DGO::Geometry
      include DGO::TileMap
      include DGO::Interval
      include DGO::Misc
      
      attr_reader :texture_manager
      attr_reader :player, :map, :layers, :global_model
      attr_reader :show_width, :show_height, :grid_size
      attr_reader :buffer, :second_buffer
      attr_reader :character_list, :events, :chipsets
      attr_reader :window_manager, :event_interpretor
      attr_reader :frame, :frame_runner, :panorama
      attr_accessor :base_x, :base_y
      attr_accessor :clock_control, :tasks
      def initialize(global_model, options = {})
        @texture_manager = TextureManager.new("./images")
        @global_model = global_model
        @global_model.variables[12] = -1
        
        # load player start info
        start_info = @global_model.load_start_info

        # Set player's initial position
        if options['map_id']
          map_id = options['map_id']
          start_x = options['start_x']
          start_y =  options['start_y']
        else
          map_id = start_info['start_map_id']
          start_x = start_info['start_x'].to_i
          start_y = start_info['start_y'].to_i
        end
		
        @character_chipsets = {}
        @grid_size = GRID_SIZE
        
        # Load Map Data
        data = MapLoader.load_map(".", "data/map/" + map_id + ".json") #load map
        
        @panorama = data[:panorama]
        @map =  Map.new(data[:x_count], data[:y_count], MAP_H_GRIDS, MAP_V_GRIDS, GRID_SIZE, GRID_SIZE, data[:collision_data], 2, 4, :game)
        @character_list = []
        @character_table = {}

        @layers = []
        data[:layers].each {|l| @layers << MapLayer.new(@map, l)}

        @show_width = GAME_SCREEN_WIDTH
        @show_height = GAME_SCREEN_HEIGHT
        @buffer = Texture.new(@show_width, @show_height)

        @window_manager = WindowManager.new

        player_event = Event.new(0, self, self.add_character(0, start_x, start_y))
        p = options['player']
        if p          
          player_event << EventPage.new(player_event, self, [['never']], [], [], [], EventParameters.clone_character_event_parameters(p))
          self.player.dir_x = options['player'].dir_x
          self.player.dir_y = options['player'].dir_y
        else
          player_event << EventPage.new(player_event, self, [['never']], [], [], [], EventParameters.new)
        end

        @events = []
        @events << player_event
        @events += EventLoader.load_events(self, map_id)
        @character_list.sort!{|a, b|a.id <=> b.id}
        
        @tasks = []
      end

      def player
        return @character_table[0]
      end
      
      def add_character(no, x, y)
        t = Character.new(@map, nil, 0, 0, no, x, y, true)
        @character_list << t
        @character_table[no] = t
        return t
      end

      #
      # list of non-player characters
      #
      # def npc_list
        # raise('a');
        # @character_list - @controlable_list
      # end
      #
      # Get characte chipset
      #
      def get_character_chipset(id)       
        return unless id
        unless @character_chipsets[id]
          @character_chipsets[id] = CharacterChipset.new(
            id, 
            @texture_manager.get_texture("game/character/#{id}"), 
            @global_model.charasets_settings[id]['gw'], 
            @global_model.charasets_settings[id]['gh'], 
            @global_model.charasets_settings[id]['anime_num'], 
            @global_model.charasets_settings[id]['dir_num']
          )
        end
        return @character_chipsets[id]
      end
      #
      # Get character by ID
      #
      def get_character(id)
        return @character_table[id]
      end
      #
      # Get event by index
      #
      def get_event(idx)
        return @events[idx]
      end
      #
      # Get event by id
      #
      def get_event_by_id(id)
        @events.each do |event|
          return event if event.id == id
        end
        return nil
      end
    end
  end
end
