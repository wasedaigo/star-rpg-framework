var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var rpg2d;
(function (rpg2d) {
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point() {
            _super.apply(this, arguments);

        }
        return Point;
    })(cc.Point);
    rpg2d.Point = Point;    
    ; ;
    var Size = (function (_super) {
        __extends(Size, _super);
        function Size() {
            _super.apply(this, arguments);

        }
        return Size;
    })(cc.Size);
    rpg2d.Size = Size;    
    ; ;
    function MakePoint(x, y) {
        return new Point(x, y);
    }
    rpg2d.MakePoint = MakePoint;
    ; ;
    function PointZero() {
        return new Point(0, 0);
    }
    rpg2d.PointZero = PointZero;
    ; ;
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            _super.apply(this, arguments);

        }
        Label.create = function create(text, fontfamiliy, fontsize) {
            return cc.LabelTTF.create(text, fontfamiliy, fontsize);
        }
        return Label;
    })(cc.LabelTTF);
    rpg2d.Label = Label;    
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.apply(this, arguments);

        }
        Scene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            this.scheduleUpdate();
        };
        Scene.prototype.update = function (dt) {
        };
        return Scene;
    })(cc.Scene);
    rpg2d.Scene = Scene;    
    (function (SceneDirector) {
        function runWithScene(scene, config) {
            var director = cc.Director.getInstance();
            director.setDisplayStats(config['showFPS']);
            director.setAnimationInterval(1 / config['frameRate']);
            director.runWithScene(scene);
            console.log("runWithScene");
        }
        SceneDirector.runWithScene = runWithScene;
        function replaceScene(scene) {
            cc.Director.getInstance().replaceScene(scene);
        }
        SceneDirector.replaceScene = replaceScene;
    })(rpg2d.SceneDirector || (rpg2d.SceneDirector = {}));
    var SceneDirector = rpg2d.SceneDirector;

})(rpg2d || (rpg2d = {}));

//@ sourceMappingURL=rpg2d.js.map
