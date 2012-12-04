///<reference path='../cocos2d.d.ts'/>
///<reference path='Scene_Base.ts'/>
///<reference path='Scene_Map.ts'/>
///<reference path='../../../ebi/Audio.ts' />
///<reference path='../../../ebi/TextureCache.ts' />

/**
 * Scene_Title
 *
 * タイトルシーンの表示をします
 *
 */
class Scene_Title extends Scene_Base {
    private static BGM:string = "res/sounds/bgm/tick.wav";
    private bgmId_;

    public start() {
        var label = cc.LabelTTF.create("Title Scene", "Arial", 20);
        label.setPosition(cc.p(160, 450));
        this.addChild(label);

        // setup title image
        ebi.TextureCache.instance.addImage("res/images/game/title.png");
        var sprite = cc.Sprite.createWithTexture(
            ebi.TextureCache.instance.getTexture("res/images/game/title.png"), 
            cc.rect(0, 0, 240, 240)
        );
        sprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(sprite);

        // Setup clickable menu item
        var label: cc.LabelTTF = cc.LabelTTF.create("Go to Map", "Arial", 20);
        var menuItem: cc.MenuItemLabel = cc.MenuItemLabel.create(label, this.onClicked, this);
        var menu: cc.Menu = cc.Menu.create(menuItem, null);
        var s: cc.Size = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
        this.addChild(menu);

        // Play music
        this.bgmId_ = ebi.Audio.instance.playEffect(Scene_Title.BGM, true);
    }

    private onClicked() {
        ebi.Audio.instance.stopEffect(this.bgmId_);
        cc.Director.getInstance().replaceScene(new Scene_Map());
    }
    
    private terminate() {
    }
}
