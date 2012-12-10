require "mini_rpg1/scene"
require "mini_rpg1/play_scene/model"
require "mini_rpg1/play_scene/controller"
require "mini_rpg1/play_scene/view"

module MiniRPG1
  module PlayScene
    class Scene < MiniRPG1::Scene
      def initialize(global_model, options = {})
        super(PlayScene::Model.new(global_model, options), PlayScene::View.new, PlayScene::Controller.new)
      end
    end
  end
end