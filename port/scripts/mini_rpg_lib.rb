$KCODE = 'UTF8'
require "mini_rpg1/config"

module MiniRPGLib
  def self.render_number(s, texture, value, x, y, width = 6, height = 10)
    i = 0
    str = value.to_s
    arr = str.split(/ */)

    arr.each do |char| 
      case char
      when '/'
        v = 11
      when '-'
        v = 10
      else
        v = char.to_i
      end
      s.render_texture(texture, x + i * width, y, :src_x => v * width, :src_width => width)
      i += 1
    end
  end

  def self.get_text_img(text)
    texts = text.split("\n")
    
    w, h, tw, th =  0, 0, 0, 0
    texts.each do |t|
      tw, th = MiniRPG1::Config::FONT.get_size(t)
      w = [tw, w].max
    end

    w += 10
    h = th * texts.length + 6
    tex = Texture.new(w, h)
    
    texts.each_with_index do |t, i|
      tex.render_shadow_text(t, 0, i * th, MiniRPG1::Config::FONT, Color.new(0, 0, 0, 255), Color.new(0, 0, 0, 64))
    end
    return tex
    text = text.to_mbstr
    #p "--------"

    texts = text.split("\n")

    max = 0
    ty = 9
    arr = []
    texts.each do |txt|
      t_arr = []
      txt = txt.to_mbstr
      max = txt.length if txt.length > max
      t_max = 0
      txt.each do |c|
        info = self.get_char_info(c)
        t_arr << info
        case info[0]
          when :hr, :ka
            t_max += 8
            ty = 13
          when :en
            t_max += 5
          else
            t_max += 3
        end
      end
      max = t_max if t_max > max
      arr << t_arr
    end
    tex = Texture.new(max, ty * arr.length + 1)
    pos_x = 0
    pos_y = 0
    ty = 9
    arr.each do |t_arr|
      d = 1
      t_arr.each_with_index do |info, i|
        case info[0]
          when :hr
            tex.render_texture($res.get_texture("system/font_ja_hr"), pos_x, pos_y, :width => 8, :src_width => 8, :src_x => 8 * info[1])
            pos_x += 8
            ty = 13
            d = 5
          when :ka
            tex.render_texture($res.get_texture("system/font_ja_ka"), pos_x, pos_y, :width => 8, :src_width => 8, :src_x => 8 * info[1])
            pos_x += 8
            ty = 13
            d = 5
          when :en
            tex.render_texture($res.get_texture("system/font_en"), pos_x, pos_y + d, :width => 5, :src_width => 5, :src_x => 5 * info[1])
            pos_x += 5
            
          else
            pos_x += 2
        end
      end
      pos_x = 0
      pos_y += ty
    end
    #Game.terminate
    return tex
  end
  
  def self.get_char_info(char)
    # str = ""
    # char.each_byte{ |c| str += c.to_s}
    # p str
    type = ""
    index = 0
    
    if char[0] <= 126 && char[0] >= 33
      index = char[0] - 33
      type = :en
    else
      case char[0]
        when 227
          case char[1]
            when 129
              if char[2] >= 129 && char[2] <= 191
                index = char[2] - 129
                type = :hr
              end
            when 130
              if char[2] >= 128 && char[2] <= 147
                index = char[2] - 128 + 63
                type = :hr
              else
                if char[2] >= 161 && char[2] <= 191
                  index = char[2] - 161
                  type = :ka
                end
              end
            when 131
              if char[2] >= 129 && char[2] <= 188
                index = char[2] - 129 + 32
                type = :ka
              end
          end
        when
          if char[1] == 188
            case char[2]
              when 129
                index = 84
                type = :hr
              when 159
                index = 85
                type = :hr
            end
          end
      end
    end
    
    return type, index
  end
end
