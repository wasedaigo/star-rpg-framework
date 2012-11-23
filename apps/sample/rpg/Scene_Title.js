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
    };
    Scene_Title.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        console.log("title " + dt);
    };
    return Scene_Title;
})(Scene_Base);
//@ sourceMappingURL=Scene_Title.js.map
