/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var TestScene = cc.Scene.extend({
    ctor:function (bPortrait) {
        this._super();
        this.init();
    },
    onEnter:function () {
        this._super();
        var label = cc.LabelTTF.create("MainMenu", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this, this.MainMenuCallback);

        var menu = cc.Menu.create(menuItem, null);
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width - 50, 25));

        this.addChild(menu, 1);
    },
    runThisTest:function () {

    },
    MainMenuCallback:function () {
        var scene = cc.Scene.create();
        var layer = new TestController();
        scene.addChild(layer);
        cc.Director.getInstance().replaceScene(scene);
    }
});

var s_pathClose = null;
var TestController = cc.Layer.extend({
    ctor:function () {
        var closeItem = cc.MenuItemImage.create(s_pathClose, s_pathClose, this, this.closeCallback);
        var menu = cc.Menu.create(closeItem, null);//pmenu is just a holder for the close button
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        closeItem.setPosition(cc.p(s.width - 30, s.height - 30));

        var label = cc.LabelTTF.create("Hello World", "Arial", 24);
        label.setPosition(cc.p(160, 240));

        this.addChild(label);
        this.addChild(menu);
    },
    closeCallback:function () {
        history.go(-1);
    }
});