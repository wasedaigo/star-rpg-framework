var TitleLayer = cc.Layer.extend({
    onEnter:function () {
        this._super();

        var label = cc.LabelTTF.create("Title", "Arial", 24);
        label.setPosition(cc.p(160, 460));
        this.addChild(label);

        var label = cc.LabelTTF.create("Go to Map", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this, this.gotoMapClicked);
        var menu = cc.Menu.create(menuItem, null);
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width / 2, s.height / 2));

        this.addChild(menu);
    },

    gotoMapClicked: function() {
        cc.Director.getInstance().replaceScene(new MapScene());
    }
});

var TitleScene = BaseScene.extend({
    onEnter:function () {
        this._super();
        var layer = new TitleLayer();
        this.addChild(layer);
    }
});
