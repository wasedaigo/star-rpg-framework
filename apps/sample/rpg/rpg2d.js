var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var rpg2d;
(function (rpg2d) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.apply(this, arguments);

        }
        Scene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            this.scheduleUpdate();
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
