module MiniRPG1
  module EndingScene
    class View
      def update(model, s)
        s.render_texture(model.the_end_texture, 80, 100)
        s.render_texture(model.author_texture, 110, 210)
      end
    end
  end
end
