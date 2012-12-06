/// <reference path='../../../ebi/game/Input.ts' />
/// <reference path='../../../ebi/game/Scene.ts' />
/**
 * Scene_Base
 *
 * シーンのベースとなります
 *
 */
class Scene_Base extends ebi.game.Scene {

    public update(dt:number): void {
	ebi.game.Input.update();
    }
}
