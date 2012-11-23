///<reference path='Scene_Base.ts'/>
/**
 * Scene_Title
 *
 * タイトルシーンの表示をします
 *
 */
class Scene_Title extends Scene_Base {
	public update(dt:number) {
		super.update(dt);
		console.log("title " + dt);
	}
}
