require "dgo/interval/interval_runner"
require "dgo/interval/sequence"
require "dgo/interval/lerp"
module MiniRPG1
  module TitleScene
    class Model
      include DGO::Interval
      attr_reader :title_texture,  :push_start_texture,  :runner, :global_model
      attr_accessor :push_start_alpha
      def initialize(global_model)
        @global_model = global_model
        @title_texture = Texture.load("images/game/title")
        @push_start_texture = Texture.load("images/game/push_start")
        @push_start_alpha = 0
        
        Audio.play_bgm("sounds/se/tick", :loop => true) unless Audio.playing_bgm?
        @runner = IntervalRunner.new(
          Sequence.new(
            Lerp.new(30, 0, 255){|v|@push_start_alpha = v},
            Lerp.new(30, 255, 0){|v|@push_start_alpha = v}
          )
        )
      end
    end
  end
end
