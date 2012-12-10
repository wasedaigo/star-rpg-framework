module MiniRPG1
  module EndingScene
    class Model
      attr_reader :the_end_texture, :author_texture, :global_model
      def initialize(global_model)
        @global_model = global_model
        @the_end_texture = Texture.load("images/game/the_end")
        @author_texture = Texture.load("images/game/author")
        Audio.play_bgm("sounds/se/tick", :loop => true)
      end
    end
  end
end
