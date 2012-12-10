include StarRuby
class ResourceManager
  attr_reader :root_path, :playing_bgm
  def initialize(root_path, texture_path, se_path, bgm_path, data_path, tool_path)
    @root_path = root_path
    @texture_path = texture_path
    @se_path = se_path
    @bgm_path = bgm_path
    @data_path = data_path
    @tool_path = tool_path
    @textures = {}
    @playing_bgm = ""
  end
  
  def tool_path
    return @root_path + @tool_path
  end
  
  def data_path
    return @root_path + @data_path
  end
  
  def image_path
    return @root_path + @texture_path
  end
  
  def se_path
    return @root_path + @se_path
  end
  
  def bgm_path
    return @root_path + @bgm_path
  end
  
  def clear_texture_cache
    @textures.clear
  end
  
  def get_texture(id, cache = true)
    #raise ("d")
    if cache
      if @textures[id].nil?
        @textures[id] = Texture.load("#{@root_path}#{@texture_path}#{id}")
      end
      return @textures[id]
    else
      raise "don't use this option"
      return Texture.load("#{@root_path}#{@texture_path}#{id}")
    end
  end
  
  def texture_exists?(id)
    return File.exist?("#{@root_path}#{@texture_path}#{id}.png")
  end

  def play_bgm(id, time = 0)
    @playing_bgm = id
    Audio.play_bgm("#{@root_path}#{@bgm_path}#{id}", :loop => true, :time => time)
  end
  
  def play_se(id)
    Audio.play_se("#{@root_path}#{@se_path}#{id}")
  end
end
