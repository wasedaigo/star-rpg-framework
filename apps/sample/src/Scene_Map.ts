/// <reference path='../cocos2d.d.ts' />
/// <reference path='../../../ebi/game/Input.ts' />
/// <reference path='./Scene_Base.ts' />
/// <reference path='./Scene_Title.ts' />
/// <reference path='./Spriteset_Map.ts' />

/**
 * Scene_Map
 *
 * マップシーンの表示をします
 *
 */
class Scene_Map extends Scene_Base {
    private _spriteSetMap;

	public start() {
        // Add Title
		var label = cc.LabelTTF.create("Map Scene", "Arial", 20);
		label.setPosition(cc.p(160, 450));
		this.addChild(label);

        // Added clickable menu item
        var label: cc.LabelTTF = cc.LabelTTF.create("Go to Title", "Arial", 20);
        var menuItem: cc.MenuItemLabel = cc.MenuItemLabel.create(label, this.onClicked, this);
        var menu: cc.Menu = cc.Menu.create(menuItem, null);
        var s: cc.Size = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width / 2, s.height / 2));
        this.addChild(menu);

        // Create sprites
        this.createSpriteSet();
	}

    public terminate() {
        this.disposeSpriteSet();
    }

	private onClicked() {
		cc.Director.getInstance().replaceScene(new Scene_Title());
	}

    private createSpriteSet() {
        this._spriteSetMap = new Spriteset_Map(this);           
    }

    private disposeSpriteSet() {
        this._spriteSetMap.dispose();
    }

    public update(dt:number) {
        super.update(dt);

        if (ebi.game.Input.isNewlyTouched) {
            var location: ebi.game.Point = ebi.game.Input.location;
            this._spriteSetMap.getGamePlayer().moveTo(location.x, location.y);
        }
        this._spriteSetMap.update(dt);
    }
}
