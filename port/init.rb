$LOAD_PATH << "."
$LOAD_PATH << "./scripts"

require "starruby"
include StarRuby

require "simple_input"

require "extension"
require "mini_rpg1/config"
require "mini_rpg1/scene_stack"
require "mini_rpg1/title_scene/scene"
require "mini_rpg1/global_model"

class Main
  include MiniRPG1::Config
  def initialize(global_model)
    scene_stack = nil
    Game.run(240, 240, :window_scale => 2, :fullscreen => false, :title => "Clock of Atonement", :fps => 30) do |game|
      if scene_stack.nil?
        scene = MiniRPG1::TitleScene::Scene.new(global_model)
        scene_stack = MiniRPG1::SceneStack.new(scene)
      end
      game.screen.fill(Color.new(0, 0, 0, 255))
      if current_scene = scene_stack.current
        current_scene.update(scene_stack)
        current_scene.render(game.screen)
      else
        break
      end
      break if SimpleInput.pressed_newly?(:escape)
      #game.screen.render_text(game.real_fps.floor.to_s, 0, 0, FONT, Color.new(255, 255, 255, 255))
      if SimpleInput.pressed?(:d)
        game.fps = 3000
      else
        game.fps = 30
      end
      #GC.start
    end
  end
end

global_model = GlobalModel.new
Main.new(global_model)