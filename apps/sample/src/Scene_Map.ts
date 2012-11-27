///<reference path='Scene_Base.ts'/>
///<reference path='Scene_Title.ts'/>
///<reference path='Spriteset_Map.ts'/>
/**
 * Scene_Map
 *
 * マップシーンの表示をします
 *
 */
class Scene_Map extends Scene_Base {
    private _spriteSetMap;
	public start() {
		var label = rpg2d.Label.create("Map Scene", "Arial", 20);
		label.setPosition(rpg2d.MakePoint(160, 450));
		this.addChild(label);

        var label: rpg2d.Label = rpg2d.Label.create("Go to Title", "Arial", 20);
        var menuItem: rpg2d.MenuItemLabel = rpg2d.MenuItemLabel.create(label, this.onClicked, this);
        var menu: rpg2d.Menu = rpg2d.Menu.create(menuItem, null);
        var s: rpg2d.Size = rpg2d.SceneDirector.getWinSize();
        menu.setPosition(rpg2d.PointZero());
        menuItem.setPosition(rpg2d.MakePoint(s.width / 2, s.height / 2));
        this.addChild(menu);

        this.createSpriteSet();
	}

    public terminate() {
        this.disposeSpriteSet();
    }

	private onClicked() {
		rpg2d.SceneDirector.replaceScene(new Scene_Title());
	}

    private createSpriteSet() {
        this._spriteSetMap = new Spriteset_Map(this);           
    }

    private disposeSpriteSet() {
        this._spriteSetMap.dispose();
    }
}
