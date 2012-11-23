var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Scenes;
(function (Scenes) {
    var TitleLayer = (function (_super) {
        __extends(TitleLayer, _super);
        function TitleLayer() {
            _super.apply(this, arguments);

        }
        TitleLayer.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var label = cc.LabelTTF.create("Title", "Arial", 24);
            label.setPosition(cc.p(160, 460));
            this.addChild(label);
            var label = cc.LabelTTF.create("Go to Title", "Arial", 20);
            var menuItem = cc.MenuItemLabel.create(label, this, this.gotoTitleClicked);
            var menu = cc.Menu.create(menuItem, null);
            var s = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
            this.addChild(menu);
        };
        TitleLayer.prototype.gotoTitleClicked = function () {
            cc.Director.getInstance().replaceScene(new Scenes.MapScene());
        };
        return TitleLayer;
    })(cc.Layer);    
    var TitleScene = (function (_super) {
        __extends(TitleScene, _super);
        function TitleScene() {
            _super.apply(this, arguments);

        }
        TitleScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var layer = new TitleLayer();
            this.addChild(layer);
        };
        return TitleScene;
    })(Scenes.BaseScene);
    Scenes.TitleScene = TitleScene;    
})(Scenes || (Scenes = {}));

//@ sourceMappingURL=TitleScene.js.map
