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
        private ccInputLayer_: any; // temporary

        /*
         * The keys are the tags of the sprites. The values are the sprites.
         */
        private shownSprites_: Object = {};
        private shownTmxTiledMaps_: Object = {};

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

            var scene: cc.Scene = this.ccApp_.scene;
            if (!this.ccInputLayer_) {
                this.ccInputLayer_ = new Cocos2dInputLayer();
                this.ccInputLayer_.init();
                this.ccInputLayer_.setTouchEnabled(true);
                // TODO: Replace the magic number
                scene.addChild(this.ccInputLayer_, 10000000);
            }
            
            var sprites = ebi.game.Sprite.sprites.map((sprite) => sprite.innerObject);
            Game.addAndRemoveNodes(scene, this.shownSprites_, sprites);
            var maps = ebi.game.TmxTiledMap.tmxTiledMaps.map((map) => map.innerObject);
            Game.addAndRemoveNodes(scene, this.shownTmxTiledMaps_, maps);
        }

        private static addAndRemoveNodes(scene: cc.Scene, nodesHash: Object, drawables: IDrawable[]): void {
            var nodesToShow = drawables.map((drawable: IDrawable) => drawable.innerObject);
            Object.keys(nodesHash).forEach((tagStr: string): void => {
                var addedNode: cc.Node = nodesHash[tagStr];
                if (nodesToShow.indexOf(addedNode) === -1) {
                    var tag: number = parseInt(tagStr, 10);
                    scene.removeChildByTag(tag);
                    delete nodesHash[tagStr];
                    console.log('Node Removed:', tag);
                }
            });
            drawables.forEach((drawable: IDrawable): void => {
                var node = drawable.innerObject;
                var tag: number = node.getTag();
                if (!(tag.toString() in nodesHash)) {
                    scene.addChild(node, drawable.z, tag);
                    nodesHash[tag.toString()] = node;
                    console.log('Node Added:', tag);
                }
            });
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
