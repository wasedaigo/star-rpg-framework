///<reference path='./BaseScene.ts'/>
///<reference path='./MapScene.ts'/>

module Scene {
    class TitleLayer extends cc.Layer {
        public onEnter() {
            super.onEnter();

            var label: cc.LabelTTF = cc.LabelTTF.create("Title", "Arial", 24);
            label.setPosition(cc.p(160, 460));
            this.addChild(label);

            var label: cc.LabelTTF = cc.LabelTTF.create("Go to Title", "Arial", 20);
            var menuItem: cc.MenuItemLabel = cc.MenuItemLabel.create(label, this, this.gotoTitleClicked);
            var menu: cc.Menu = cc.Menu.create(menuItem, null);
            var s: cc.Size = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width / 2, s.height / 2));

            this.addChild(menu);
        }

        private gotoTitleClicked() {
            cc.Director.getInstance().replaceScene(new MapScene());
        }
    }

    export class TitleScene extends BaseScene {
        public onEnter() {
            super.onEnter();
            var layer: TitleLayer = new TitleLayer();
            this.addChild(layer);
        }
    }
}
