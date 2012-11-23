var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Scenes;
(function (Scenes) {
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            _super.apply(this, arguments);

        }
        BaseScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var label = cc.LabelTTF.create("Quit", "Arial", 20);
            var menuItem = cc.MenuItemLabel.create(label, this, this.quitCallback);
            var menu = cc.Menu.create(menuItem, null);
            var s = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width - 50, 25));
            this.addChild(menu);
        };
        BaseScene.prototype.quitCallback = function () {
            history.go(-1);
        };
        return BaseScene;
    })(Scene);
    Scenes.BaseScene = BaseScene;    
})(Scenes || (Scenes = {}));

//@ sourceMappingURL=BaseScene.js.map
