///<reference path='../cocos2d/cocos2d.d.ts'/>
module Scene {
    export class BaseScene extends cc.Scene {
        public onEnter() {
            super.onEnter();
            var label:cc.LabelTTF = cc.LabelTTF.create("Quit", "Arial", 20);
            var menuItem:cc.MenuItemLabel = cc.MenuItemLabel.create(label, this, this.quitCallback);
            var menu:cc.Menu = cc.Menu.create(menuItem, null);
            var s = cc.Director.getInstance().getWinSize();
            menu.setPosition(cc.PointZero());
            menuItem.setPosition(cc.p(s.width - 50, 25));

            this.addChild(menu);
        }

        private quitCallback() {
            history.go(-1);
        }
    }
}