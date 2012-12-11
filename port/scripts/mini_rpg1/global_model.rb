class GlobalModel
  attr_reader :switches, :variables, :charasets_settings
  attr_accessor :screen_red, :screen_green, :screen_blue
  def initialize
    @charasets_settings = self.load_character_settings
    @switches = Array.new(100, false)
    @variables = Array.new(50, 0)
    @screen_red = 0
    @screen_green = 0
    @screen_blue = 0
  end

  def reset
    @switches = Array.new(100, false)
    @variables = Array.new(50, 0)
  end
  #
  # * Initialize character_chips_setting
  #
  def load_character_settings
    charasets_setting = {}
    File.open("data/common/charasets_setting.json", "r") { |f| charasets_setting = JSON.parse(f.read) }
    return charasets_setting
  end
  
  #
  # * Initialize Hash
  #
  def load_start_info
    start_info = {}
    File.open("data/common/start.json", "r") { |f| start_info = JSON.parse(f.read) }
    return start_info
  end
end