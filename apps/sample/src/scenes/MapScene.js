var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Scene;
(function (Scene) {
    var MapLayer = (function (_super) {
        __extends(MapLayer, _super);
        function MapLayer() {
            _super.apply(this, arguments);

        }
        MapLayer.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var label = cc.LabelTTF.create("Map", "Arial", 24);
            label.setPosition(cc.p(160, 460));
            this.addChild(label);
            var label = cc.LabelTTF.create("Go to Map", "Arial", 20);
            var menuItem = cc.MenuItemLabel.create(label, this, this.gotoTitleClicked);
            var menu = cc.Menu.create(menuItem, null);
            var s = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
            this.addChild(menu);
            var map = cc.TMXTiledMap.create("res/tmx/ortho-objects.tmx");
            this.addChild(map, -1, 1);
        };
        MapLayer.prototype.gotoTitleClicked = function () {
            cc.Director.getInstance().replaceScene(new Scene.TitleScene());
        };
        return MapLayer;
    })(cc.Layer);    
    var MapScene = (function (_super) {
        __extends(MapScene, _super);
        function MapScene() {
            _super.apply(this, arguments);

        }
        MapScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            var layer = new MapLayer();
            this.addChild(layer);
        };
        return MapScene;
    })(Scene.BaseScene);
    Scene.MapScene = MapScene;    
})(Scene || (Scene = {}));

//@ sourceMappingURL=MapScene.js.map
