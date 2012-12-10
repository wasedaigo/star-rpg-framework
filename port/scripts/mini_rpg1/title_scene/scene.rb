require "mini_rpg1/scene"
require "mini_rpg1/title_scene/model"
require "mini_rpg1/title_scene/controller"
require "mini_rpg1/title_scene/view"

module MiniRPG1
  module TitleScene
    class Scene < MiniRPG1::Scene
      def initialize(global_model)
        global_model.reset
        super(TitleScene::Model.new(global_model), TitleScene::View.new, TitleScene::Controller.new)
      end
    end
  end
end
