require "mini_rpg1/scene"
require "mini_rpg1/ending_scene/model"
require "mini_rpg1/ending_scene/controller"
require "mini_rpg1/ending_scene/view"

module MiniRPG1
  module EndingScene
    class Scene < MiniRPG1::Scene
      def initialize(global_model)
        super(Model.new(global_model), View.new, Controller.new)
      end
    end
  end
end
