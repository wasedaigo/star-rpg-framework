///<reference path='./BaseScene.ts'/>
///<reference path='./TitleScene.ts'/>

module Scene {
    class MapLayer extends cc.Layer {
        public onEnter() {
            super.onEnter();

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
        }

        private gotoTitleClicked() {
            cc.Director.getInstance().replaceScene(new TitleScene());
        }
    }

    export class MapScene extends BaseScene {
        public onEnter() {
            super.onEnter();
            var layer = new MapLayer();
            this.addChild(layer);
        }
    }
}
