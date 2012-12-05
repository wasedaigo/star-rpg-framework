/// <reference path='../../../ebi/Input.ts' />
/// <reference path='../../../ebi/Scene.ts' />
/**
 * Scene_Base
 *
 * シーンのベースとなります
 *
 */
class Scene_Base extends ebi.Scene {

	public update(dt:number): void {
		ebi.Input.update();
	}
}
