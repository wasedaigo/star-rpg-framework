require "mini_rpg1/play_scene/scene"
require "simple_input"

module MiniRPG1
  module TitleScene
    class Controller
      def update(model, stack, scene)
        model.runner.reset if model.runner.done?
        model.runner.update unless model.runner.done?
        if SimpleInput.pressed_newly?(:space)
          Audio.stop_bgm
          stack.pop
          
          stack << MiniRPG1::PlayScene::Scene.new(model.global_model)
          #stack << MiniRPG1::BattleScene::Scene.new(model.global_model)
        end
      end
    end
  end
end
