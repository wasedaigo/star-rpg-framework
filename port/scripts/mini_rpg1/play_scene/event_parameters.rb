module MiniRPG1
  module PlayScene
    class EventParameters
      attr_accessor :chip_id, :hit_x, :hit_y, :offset_x, :offset_y, :dir, :frame_no, :alpha, :wait, :speed_type, :route_repeat, :route_skip, :layer, :dir_fix, :move_anime, :stay_anime, :pass_tile, :pass_character, :pass_event, :visible
      def initialize(chip_id = nil, hit_x = 1, hit_y = 1, offset_x = 0, offset_y = 0, dir = 3, frame_no = 1, alpha = 255, wait = 0, speed_type = 1, route_repeat = false, route_skip = false, layer = 1, dir_fix = false, move_anime = true, stay_anime = false, pass_tile = false, pass_character = false, pass_event = false, visible = false)
        @chip_id = chip_id
        @hit_x = hit_x
        @hit_y = hit_y 
        @offset_x = offset_x
        @offset_y = offset_y
        @dir = dir
        @frame_no = frame_no 
        @alpha = alpha 
        @wait = wait
        @speed_type = speed_type 
        @route_repeat = route_repeat 
        @route_skip = route_skip
        @layer = layer 
        @dir_fix = dir_fix
        @move_anime = move_anime
        @stay_anime = stay_anime
        @pass_tile = pass_tile
        @pass_character = pass_character
        @pass_event = pass_event
        @visible = visible
      end
      
      def self.clone_character_event_parameters(p)
        EventParameters.new(
          p.chipset.name,
          p.hit_x,
          p.hit_y,
          p.offset_x,
          p.offset_y,
          p.sy * p.chipset.dir_number + p.dir, 
          p.sx * p.chipset.animation_frame_number + p.frame_no, 
          p.alpha, 
          p.wait, 
          p.speed_type, 
          false, 
          false, 
          p.layer, 
          p.dir_fix, 
          p.move_anime, 
          p.stay_anime, 
          p.pass_tile, 
          p.pass_character, 
          p.pass_event,
          p.visible
        )
      end
    end
  end
end