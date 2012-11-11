var BaseScene = cc.Scene.extend({
    ctor:function (bPortrait) {
        this._super();
        this.init();
    },
    onEnter:function () {
        this._super();
        var label = cc.LabelTTF.create("Quit", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this, this.quitCallback);
        var menu = cc.Menu.create(menuItem, null);
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width - 50, 25));

        this.addChild(menu);
    },
    quitCallback:function () {
        history.go(-1);
    }
});