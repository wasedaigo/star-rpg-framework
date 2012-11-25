var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Scene_Title = (function (_super) {
    __extends(Scene_Title, _super);
    function Scene_Title() {
        _super.apply(this, arguments);

    }
    Scene_Title.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var label = rpg2d.Label.create("Title Scene", "Arial", 20);
        label.setPosition(rpg2d.MakePoint(160, 450));
        this.addChild(label);
        var label = rpg2d.Label.create("Go to Map", "Arial", 20);
        var menuItem = rpg2d.MenuItemLabel.create(label, this, this.onClicked);
        var menu = rpg2d.Menu.create(menuItem, null);
        var s = rpg2d.SceneDirector.getWinSize();
        menu.setPosition(rpg2d.PointZero());
        menuItem.setPosition(rpg2d.MakePoint(s.width / 2, s.height / 2));
        this.addChild(menu);
    };
    Scene_Title.prototype.onClicked = function () {
        rpg2d.SceneDirector.replaceScene(new Scene_Map());
    };
    return Scene_Title;
})(Scene_Base);
//@ sourceMappingURL=Scene_Title.js.map
