/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../game/Input.ts' />

module ebi {
    export module rpg {
        export class SceneManager {
            public static get scene(): Scene_Base {
                return null;
            }
            public static returnScene(): void {}
        }
    }
}

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

            public main(): void {
                // この実装、 Fiber 前提になっていると思われるので変えましょう
                this.start();
                this.postStart();
                if (this.isSceneChanging) {
                    this.update(0); // 適当な数字を入れてる
                }
                this.preTerminate();
                this.terminate();
            }

            public start(): void {
            }

            public postStart(): void {
                this.performTransition();
                ebi.game.Input.update();
            }

            public get isSceneChanging(): bool {
                return SceneManager.scene != this;
            }

            public update(t:number): void {
                this.updateBasic();
            }
           
            public updateBasic(): void {
                ebi.game.Graphics.update();
                ebi.game.Input.update();
                this.updateAllWindows();
            }

            public preTerminate(): void {
            }

            public terminate(): void {
                ebi.game.Graphics.freeze();
                this.disposeAllWindows();
            }

            public performTransition(): void {
                ebi.game.Graphics.transition(this.transitionSpeed);
            }

            public get transitionSpeed(): number {
                return 10;
            }

            public updateAllWindows(): void {
                // TODO: Object.keys とかで列挙して実装?
            }

            public disposeAllWindows(): void {
                // TODO: Object.keys とかで列挙して実装?
            }

            public returnScene(): void {
                SceneManager.returnScene();
            }

            public fadeoutAll(time = 1000): void {
            }

            // TODO: checkGameover の実装?

            // 以下 Cocos 用

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
