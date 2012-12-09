/// <reference path='../../cc/cocos2d.d.ts' />

module ebi {

    export class Game {

        private static instance_: Game = null;
        private mainLoop_: (Game) => void;

        constructor(mainLoop: (Game) => void) {
            this.mainLoop_ = mainLoop;
        }

        public static currentGame(): Game {
            return instance_;
        }

        public static run(mainLoop: (Game) => void): void {
            if (Game.instance_ != null) {
                throw "A game has already run.";
            }
            try {
                var game = Game.instance_ = new Game(mainLoop);
                game.run();
            } finally {
                Game.instance_ = null;
            }
        }

        private initialize(): void {
        }

        private run(): void {
            // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
            // director->enableRetinaDisplay(true);

            var director:cc.Director = cc.Director.getInstance();

            // turn on display FPS
            //director.setDisplayStats(config['showFPS']);
            
            // set FPS. the default value is 1.0/60 if you don't call this
            //director.setAnimationInterval(1.0 / config['frameRate']);
            director.setAnimationInterval(1.0 / 60);

            //director.runWithScene(new Scene_Title());
        }
    }

    class Application extends cc.Application {

        private config_ = document['ccConfig'];

        public ctor(): void {
            this._super();
            cc.initDebugSetting();
            cc.setup(this.config_['tag']);
            //cc.AudioEngine.getInstance().init("mp3,ogg");
            cc.Loader.getInstance().onloading = function () {
                cc.LoaderScene.getInstance().draw();
            };
            cc.Loader.getInstance().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            cc.Loader.getInstance().preload(g_ressources);
        }

        public applicationDidFinishLaunching(): bool {
            return true;
        }

    }

}
