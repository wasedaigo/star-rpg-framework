/// <reference path='../game/Input.ts' />
/// <reference path='../game/Scene.ts' />

module ebi {

    export module rpg {

        /**
         * Scene_Base
         *
         * シーンのベースとなります
         *
         */
        export class Scene_Base extends ebi.game.Scene {

            public update(dt:number): void {
	        ebi.game.Input.update();
            }
        }

    }

}
