///<reference path='./BaseScene.ts'/>
///<reference path='./TitleScene.ts'/>

module Scenes {
    class MapLayer extends cc.Layer {
        public onEnter() {
            super.onEnter();

            var label: cc.LabelTTF = cc.LabelTTF.create("Map", "Arial", 24);
            label.setPosition(cc.p(160, 460));
            this.addChild(label);

            var label: cc.LabelTTF = cc.LabelTTF.create("Go to Title", "Arial", 20);
            var menuItem: cc.MenuItemLabel = cc.MenuItemLabel.create(label, this, this.gotoTitleClicked);
            var menu: cc.Menu = cc.Menu.create(menuItem, null);
            var s: cc.Size = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
            this.addChild(menu);

            var map: cc.TMXTiledMap = cc.TMXTiledMap.create("res/tmx/ortho-objects.tmx");
            this.addChild(map, -1, 1);
        }

        private gotoTitleClicked() {
            cc.Director.getInstance().replaceScene(new TitleScene());
        }
    }

    export class MapScene extends BaseScene {
        public onEnter() {
            super.onEnter();
            var layer: MapLayer = new MapLayer();
            this.addChild(layer);
        }
    }
}
