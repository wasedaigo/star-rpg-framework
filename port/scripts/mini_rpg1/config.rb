module MiniRPG1
  module Config
    GAME_SCREEN_WIDTH = 240
    GAME_SCREEN_HEIGHT = 240
    GAME_SCREEN_SCALE = 1
    MAP_H_GRIDS = 15
    MAP_V_GRIDS = 15
    GRID_SIZE = 16
    MAP_DELTA_Y = 0
    FONT = if Font.exist?("Arial")
             Font.new("Arial", 12)
           else
             Font.new("Bitstream Vera Sans, Roman", 12)
           end
  end
end
