require "mini_rpg1/title_scene/scene"
require "simple_input"

module MiniRPG1
  module EndingScene
    class Controller
      def update(model, stack, scene)
        if SimpleInput.pressed_newly?(:space)
          stack.pop
          stack << MiniRPG1::TitleScene::Scene.new(model.global_model)
        end
      end
    end
  end
end
