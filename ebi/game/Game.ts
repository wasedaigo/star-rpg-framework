/// <reference path='../../cc/cocos2d.d.ts' />

declare var g_resources: any;

module ebi {
    export module game {

        export class Game {

            private static instance_: Game = null;
            private mainLoop_: (Game) => void;

            constructor(mainLoop: (Game) => void) {
                // TODO: Use it!
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
                var app = new cocos2dApp();
            }
        }

        var cocos2dApp = cc.Application.extend({
            config:document['ccConfig'],
            ctor:function (scene) {
                this._super();
                this.startScene = scene;
                cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
                cc.initDebugSetting();
                cc.setup(this.config['tag']);
                cc.Loader.getInstance().onloading = function () {
                    cc.LoaderScene.getInstance().draw();
                };
                cc.Loader.getInstance().onload = function () {
                    cc.AppController.shareAppController().didFinishLaunchingWithOptions();
                };
                cc.Loader.getInstance().preload(g_resources);
            },
            applicationDidFinishLaunching:function () {
                // initialize director
                var director = cc.Director.getInstance();

                // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
                //     director->enableRetinaDisplay(true);

                // turn on display FPS
                director.setDisplayStats(this.config['showFPS']);

                // set FPS. the default value is 1.0/60 if you don't call this
                director.setAnimationInterval(1.0 / this.config['frameRate']);

                // create a scene. it's an autorelease object

                // run
                //director.runWithScene(new this.startScene());

                return true;
            }
        });

    }
}
