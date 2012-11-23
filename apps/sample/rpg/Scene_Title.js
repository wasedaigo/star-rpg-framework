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
        label.setPosition(rpg2d.MakePoint(200, 200));
        this.addChild(label);
    };
    return Scene_Title;
})(Scene_Base);
//@ sourceMappingURL=Scene_Title.js.map
