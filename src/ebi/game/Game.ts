/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./Sprite.ts' />
/// <reference path='./TmxTiledMap.ts' />
/// <reference path='./Input.ts' />

module ebi.game {

    /*
     * TODO: Rename it. This is not the 'main loop'.
     */
    export interface MainLoop {
        (Game): void;
    }

    export class Game {

        private static instance_: Game = null;
        private mainLoop_: MainLoop;
        private ccApp_: any; // temporary
        private inputLayer_: any; // temporary
        private initialized_: bool = false;

        constructor(mainLoop: MainLoop) {
            this.mainLoop_ = mainLoop;
        }

        public static get currentGame(): Game {
            return instance_;
        }

        public static run(mainLoop: MainLoop): void {
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
            this.inputLayer_ = new InputLayer();
            this.inputLayer_.init();
            this.inputLayer_.setTouchEnabled(true);
        }

        private run(): void {
            this.ccApp_ = new Cocos2dApp((game: Game) => {
                // Initialize in the first loop
                if (!this.initialized_) {
                    this.initialize();
                    this.initialized_ = true;
                }

                this.mainLoopWithRendering(game);
                ebi.game.Input.update();
            });
        }

        private mainLoopWithRendering(game: Game): void {
            this.mainLoop_(game);
            var scene: cc.Scene = this.ccApp_.scene;

            scene.removeAllChildren(true);
            // TODO: Integrate all elements to render including Sprite
            ebi.game.Sprite.sprites.forEach((sprite) => {
                scene.addChild(sprite.innerSprite, 1);
            });

            if (ebi.game.TmxTiledMap.isMapLoaded) {
                scene.addChild(ebi.game.TmxTiledMap.mapObject, 0);
            }

            scene.addChild(this.inputLayer_, 10000000);
        }
    }

    var Cocos2dApp: new(MainLoop) => cc.Application = cc.Application.extend({
        scene: null,
        // 'document' is a kind of a global variable.
        // document['ccConfig'] is defined in cocos2d.js.
        config: document['ccConfig'],
        mainLoop: null,
        ctor: function (mainLoop) {
            this._super();
            this.mainLoop = mainLoop;

            cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(this.config['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function () {
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
            this.scene = new Cocos2dScene(this.mainLoop);
            director.runWithScene(this.scene);

            return true;
        }
    });

    var Cocos2dScene: new(MainLoop) => cc.Scene = cc.Scene.extend({
        mainLoop: null,
        ctor: function(mainLoop: MainLoop): void {
            this._super();
            this.mainLoop = mainLoop;
        },
        onEnter: function(): void {
            this._super();
            this.scheduleUpdate();
        },
        update: function (delta: number): void {
            this._super();
            this.mainLoop();
        }
    });


    var InputLayer: new() => cc.Layer = cc.Layer.extend({
        setTouchEnabled: function(enabled: bool): void {
            this._super(enabled);
        },
        onTouchBegan: function(touch, event): void {
            console.log("onTouchBegan");
        },
        onTouchMoved: function(touch, event): void {
            console.log("onTouchMoved");
        },
        onTouchEnded: function(touch, event): void {
            console.log("onTouchEnded");
        },
        onTouchesBegan: function(touches, event): void {
            if (!touches[0]){ return; }
            var point:cc.Point = touches[0].getLocation();
            Input.beginTouch(point.x, point.y);
        },
        onTouchesMoved: function(touches, event): void {
            if (!touches[0]){ return; }
            var point:cc.Point = touches[0].getLocation();
            Input.moveTouch(point.x, point.y);
        },
        onTouchesEnded: function(touches, event): void {
            if (!touches[0]){ return; }
            var point:cc.Point = touches[0].getLocation();
            Input.endTouch(point.x, point.y);
        }
    });
}
