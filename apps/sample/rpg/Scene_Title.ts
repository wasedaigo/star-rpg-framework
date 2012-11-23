///<reference path='Scene_Base.ts'/>
/**
 * Scene_Title
 *
 * タイトルシーンの表示をします
 *
 */
class Scene_Title extends Scene_Base {
	public onEnter() {
		super.onEnter();
		var label = rpg2d.Label.create("Title Scene", "Arial", 20);
		label.setPosition(rpg2d.MakePoint(200, 200));
		this.addChild(label);
	}
}
