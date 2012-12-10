require "mini_rpg1/play_scene/event"
require "mini_rpg1/play_scene/event_page"
require "dgo/tile_map/character_chipset"
require "mini_rpg1/play_scene/event_parameters"
module MiniRPG1
  module PlayScene
    class EventLoader
      include DGO::TileMap
      
      #
      # * Initialize Hash
      #
      def self.load_events(model, event_id)
        events = []  
        # load events data
        data = nil
        File.open("data/event/" + event_id + ".yaml", "r"){|f| data = YAML::load(f.read)}
        
        # add characters
        data.each { |event| model.add_character(event['id'].to_i, event['pos'][0].to_i, event['pos'][1].to_i)}
        
        data.each do |event_data|
          event = Event.new(event_data['id'], model, model.get_character(event_data['id']))
          event_data['pages'].each_with_index do |page, j|
           
            status = page['status']
            options = page['options']

            ep = EventParameters.new(
            status['chip_id'], 
            status['hit_x'], 
            status['hit_y'], 
            status['off_x'], 
            status['off_y'], 
            status['dir'], 
            status['frame_no'], 
            status['alpha'], 
            status['wait'], 
            status['speed'], 
            status['route_repeat'], 
            status['route_skip'], 
            status['layer'], 
            options['dir_fix'], 
            options['move_anime'], 
            options['stay_anime'], 
            options['pass_tile'], 
            options['pass_character'], 
            options['pass_event'],
            true)
   
            event << EventPage.new(event, model, page['triggers'], page['conditions'], page['commands'], page['route'], ep)
          end
          events << event
        end
        return events
      end

    end
  end
end
