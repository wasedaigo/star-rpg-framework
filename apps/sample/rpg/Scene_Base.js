var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Scene_Base = (function (_super) {
    __extends(Scene_Base, _super);
    function Scene_Base() {
        _super.apply(this, arguments);

    }
    Scene_Base.prototype.update = function (dt) {
        console.log("main " + dt);
    };
    return Scene_Base;
})(rpg2d.Scene);
//@ sourceMappingURL=Scene_Base.js.map
