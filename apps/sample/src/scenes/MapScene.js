var MapLayer = cc.Layer.extend({
    onEnter:function () {
        this._super();

        var label = cc.LabelTTF.create("Map", "Arial", 24);
        label.setPosition(cc.p(160, 460));
        this.addChild(label);

        var label = cc.LabelTTF.create("Go to Title", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this, this.gotoTitleClicked);
        var menu = cc.Menu.create(menuItem, null);
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width / 2, s.height / 2));

        this.addChild(menu);
    },

    gotoTitleClicked: function() {
        cc.Director.getInstance().replaceScene(new TitleScene());
    }
});

var MapScene = BaseScene.extend({
    onEnter:function () {
        this._super();
        var layer = new MapLayer();
        this.addChild(layer);
    }
});
