/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../game/Input.ts' />

module ebi {

    export module rpg {

        /**
         * Scene_Base
         *
         * シーンのベースとなります
         *
         */
        export class Scene_Base extends cc.Scene {
            // TODO: Do Not inherit cc.Scene

            public start(): void {}
            public terminate(): void {}

            public update(dt:number): void {
	        ebi.game.Input.update();
            }

            public onEnter(): void {
                super.onEnter();
                this.scheduleUpdate();
                this.start();

                var layer = new ebi.game.InputLayer();
                layer.init();
                layer.setTouchEnabled(true);
                this.addChild(layer);
            }

            public onExit(): void {
                super.onExit();
                this.terminate();
            }

        }

    }

}
