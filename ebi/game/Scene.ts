/// <reference path='./cocos2d.d.ts' />
/// <reference path='./Input.ts' />

module ebi {

    module game {

        /*
         * Scene
         */
        export class Scene extends cc.Scene {
            // TODO: Do Not inherit cc.Scene

            public start(): void {}
            public terminate(): void {}

            public onEnter(): void {
                super.onEnter();
                this.scheduleUpdate();
                this.start();

                var layer = new InputLayer();
                layer.init();
                layer.setTouchEnabled(true);
                this.addChild(layer);
            }

            public onExit(): void {
                super.onExit();
                this.terminate();
            }

            public update(dt:number): void {}
        }

    }

}