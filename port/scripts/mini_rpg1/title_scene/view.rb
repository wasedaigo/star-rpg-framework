module MiniRPG1
  module TitleScene
    class View
      def update(model, s)
        s.render_texture(model.title_texture, 0, 0)
        s.render_texture(model.push_start_texture, 75, 200, :alpha => model.push_start_alpha)
      end
    end
  end
end
