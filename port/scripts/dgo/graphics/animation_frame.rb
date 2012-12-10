require "dgo/interval/parallel"

module DGO
  module Graphics
    class AnimationFrame

      include Interval

      def initialize(duration, sprites = [], effects = [])
        raise("duration must be more than 0") if duration <= 0
        @duration = duration
        @effects = effects
        @sprites = sprites
      end
      
      def generate_interval(call_back)
        @interval = Parallel.new(Wait.new(@duration){call_back.call(self)}, @effects.dup)
        return @interval
      end

      def render(s, x, y, swap_textures)
        swap_textures.each do |obj|
          @sprites.select{|sprite|sprite.texture_id == obj[:from_id]}.each do |sprite|
            sprite.swap_texture($res.get_texture(obj[:to_id]), obj[:to_id])
          end
        end

        @sprites.each do |obj|
          obj.render(s, x - obj.width/2, y - obj.height/2)
        end
        
        swap_textures.each do |obj|
          @sprites.select{|sprite|sprite.texture_id == obj[:to_id]}.each do |sprite|
            sprite.swap_texture($res.get_texture(obj[:from_id]), obj[:from_id])
          end
        end
      end

    end
  end
end
