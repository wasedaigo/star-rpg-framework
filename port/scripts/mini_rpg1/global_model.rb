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
    File.open("data/common/charasets_setting.yaml", "r") { |f| charasets_setting = YAML::load(f.read) }
    return charasets_setting
  end
  
  #
  # * Initialize Hash
  #
  def load_start_info
    start_info = {}
    File.open("data/common/start.yaml", "r") { |f| start_info = YAML::load(f.read) }
    return start_info
  end
end