require "mini_rpg_lib"
require "dgo/gadgets/baloon_window"
require "dgo/interval/interval_runner"
require "dgo/interval/wait"
require "dgo/misc/texture_manager"

module MiniRPG1
  module PlayScene
    class WindowManager
      include DGO::Gadgets
      include DGO::Interval
      include DGO::Misc

      def initialize
        @data = []
        @texture_manager = TextureManager.new("images/system/")
      end

      def create_window(text, message_type)
        tex = MiniRPGLib.get_text_img(text)
        t = @texture_manager.get_texture("#{message_type}_frame")
        window = BaloonWindow.new(0, 0, tex.width, tex.height, t, 6)
        window.frame_texture.render_texture(tex, 3, 3)
        return window
      end
      #
      # * Push new window
      #
      def push(window, target, &func)
        @data << {:window => window, :target => target, :func => func, :runner => IntervalRunner.new(Wait.new(1)), :finished => false}
      end
      #
      # * Update Windows
      #
      def update(base_x, base_y)
        @data.each{|obj| obj[:runner].update unless obj[:runner].done?}
        @data = @data.select{|obj|!obj[:finished]}
        @data.each do |obj|
          obj[:window].update((obj[:target].screen_x - base_x + 8) * Config::GAME_SCREEN_SCALE, (obj[:target].screen_y - base_y) * Config::GAME_SCREEN_SCALE, MiniRPG1::Config::GAME_SCREEN_WIDTH * MiniRPG1::Config::GAME_SCREEN_SCALE, MiniRPG1::Config::GAME_SCREEN_HEIGHT * MiniRPG1::Config::GAME_SCREEN_SCALE)
          obj[:func].call(obj) if obj[:runner].done?
        end
      end
      #
      # * Render Windows
      #     s : destination texture
      #
      def render(s, dx = 0, dy = 0)
        @data.each do |obj|
          obj[:window].render(s, dx, dy)
        end
      end
    end
  end
end
