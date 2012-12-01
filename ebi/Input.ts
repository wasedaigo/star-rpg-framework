/// <reference path='../cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    /*
     * Input
     */
    export class Input {
    }

    /*
     * Internal implementation for catching input-event
     */
    export class InputLayer extends cc.Layer {

        // TODO: Do Not inherit cc.Layer if this class is exported

        private onTouchBegan(touch, event): void {
            console.log("onTouchBegan");
        }

        private onTouchMoved(touch, event): void {
            console.log("onTouchMoved");
        }

        private onTouchEnded(touch, event): void {
            console.log("onTouchEnded");
        }

        private onTouchesBegan(touches, event): void {
            console.log("onTouchesBegan");
        }

        private onTouchesMoved(touches, event): void {
            console.log("onTouchesMoved" + JSON.stringify(touches[0]));
        }

        private onTouchesEnded(touches, event): void {
            console.log("onTouchesEnded");
        }
    }

}

