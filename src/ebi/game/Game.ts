/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='./Sprite.ts' />
/// <reference path='./TmxTiledMap.ts' />
/// <reference path='./Input.ts' />
/// <reference path='./DisplayObjects.ts' />

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
        private ccInputLayer_: any; // temporary

        private shownDrawables_: Object = {};

        constructor(mainLoop: MainLoop) {
            this.mainLoop_ = mainLoop;
        }

        public static get currentGame(): Game {
            return instance_;
        }

        public static run(mainLoop: MainLoop): void {
            if (Game.instance_ != null) {
                throw 'A game has already run.';
            }
            try {
                Game.instance_ = new Game(mainLoop);
                Game.instance_.run();
            } finally {
                Game.instance_ = null;
            }
        }

        private run(): void {
            this.ccApp_ = new Cocos2dApp((game: Game) => {
                this.mainLoopWithRendering(game);
            });
        }

        private mainLoopWithRendering(game: Game): void {
            ebi.game.Input.update();
            this.mainLoop_(game);

            // TODO: Hey, ebi.game should not refer ebi.collision!!
            ebi.collision.CollisionSystem.update();       

            var scene: cc.Scene = this.ccApp_.scene;
            if (!this.ccInputLayer_) {
                this.ccInputLayer_ = new Cocos2dInputLayer();
                this.ccInputLayer_.init();
                this.ccInputLayer_.setTouchEnabled(true);
                // TODO: Replace the magic number
                scene.addChild(this.ccInputLayer_, 10000000);
            }
            
            var drawablesToAdd = ebi.game.DisplayObjects.drawablesToAdd;
            drawablesToAdd.forEach((drawable: IDrawable) => {
                var node = drawable.innerObject;
                var tag: number = node.getTag();
                scene.addChild(node, drawable.z, tag);
                console.log('Node Added:', tag);
            });
            ebi.game.DisplayObjects.clearDrawablesToAdd();
            
            var drawablesToRemove = ebi.game.DisplayObjects.drawablesToRemove;
            drawablesToRemove.forEach((drawable: IDrawable) => {
                var node = drawable.innerObject;
                var tag: number = node.getTag();
                scene.removeChildByTag(tag);
                console.log('Node Removeed:', tag);
            });
            ebi.game.DisplayObjects.clearDrawablesToRemove();

            // Reordering drawables
            var drawablesToReorder = ebi.game.DisplayObjects.drawablesToReorder;
            drawablesToReorder.forEach((drawable: IDrawable) => {
                var node = drawable.innerObject;
                scene.reorderChild(node, drawable.z);
            });
            ebi.game.DisplayObjects.clearDrawablesToReorder();
        }

    }

    var Cocos2dApp: new(MainLoop) => cc.Application = cc.Application.extend({
        scene: null,
        world: null,
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


    var Cocos2dInputLayer: new() => cc.Layer = cc.Layer.extend({
        setTouchEnabled: function(enabled: bool): void {
            this._super(enabled);
        },
        onTouchBegan: function(touch, event): void {
            console.log('onTouchBegan');
        },
        onTouchMoved: function(touch, event): void {
            console.log('onTouchMoved');
        },
        onTouchEnded: function(touch, event): void {
            console.log('onTouchEnded');
        },
        onTouchesBegan: function(touches, event): void {
            if (!touches[0]) {
                return;
            }
            var point:cc.Point = touches[0].getLocation();
            Input.beginTouch(point.x, point.y);
        },
        onTouchesMoved: function(touches, event): void {
            if (!touches[0]) {
                return;
            }
            var point:cc.Point = touches[0].getLocation();
            Input.moveTouch(point.x, point.y);
        },
        onTouchesEnded: function(touches, event): void {
            if (!touches[0]) {
                return;
            }
            var point:cc.Point = touches[0].getLocation();
            Input.endTouch(point.x, point.y);
        }
    });
}
