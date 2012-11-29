///<reference path='Scene_Base.ts'/>
///<reference path='Scene_Map.ts'/>
/**
 * Scene_Title
 *
 * タイトルシーンの表示をします
 *
 */
class Scene_Title extends Scene_Base {
    public start() {
	var label = cc.LabelTTF.create("Title Scene", "Arial", 20);
	label.setPosition(cc.p(160, 450));
	this.addChild(label);

        var label: cc.LabelTTF = cc.LabelTTF.create("Go to Map", "Arial", 20);
        var menuItem: cc.MenuItemLabel = cc.MenuItemLabel.create(label, this.onClicked, this);
        var menu: cc.Menu = cc.Menu.create(menuItem, null);
        var s: cc.Size = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
        this.addChild(menu);
    }

    private onClicked() {
	cc.Director.getInstance().replaceScene(new Scene_Map());
    }
    
    private terminate() {
    }
}
