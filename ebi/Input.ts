/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    /*
     * Input: Singleton class
     */
    export class Input {
        private static _input: Input = null;
        private _isTouched: bool;
        private _isNewlyTouched: bool;
        private _location: Point;
        private _lastAction: string;

        constructor() {
            this._isTouched = false;
            this._isNewlyTouched = false;
            this._location = new Point(0, 0);
            this._lastAction = "";
        }

        public static get instance():Input {
            if (!Input._input) {
                Input._input = new Input();
            }
            return Input._input;
        }

        public get isTouched(): bool {
            return this._isTouched;
        }

        public get isNewlyTouched(): bool {
            return this._isNewlyTouched;
        }

        public get location(): Point {
            return this._location;
        }

        public beginTouch(location: Point) {
            this._location = location;
            this._isTouched = true;
            this._lastAction = "touchBegan";
        }

        public moveTouch(location: Point) {
            this._location = location;
            this._lastAction = "touchMoved";
        }

        public endTouch(location: Point) {
            this._location = location;
            this._lastAction = "touchEnded";
            this._isTouched = false;
        }

        public update(): void {
            // Set the flag if the screen was taped at this frame
            this._isNewlyTouched = false;
            if (this._lastAction === "touchBegan") {
                this._isNewlyTouched = true;
            }

            this._lastAction = "";
        }
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
            if (!touches[0]){ return; }
            var location:Point = <Point>(touches[0].getLocation());
            Input.instance.beginTouch(location);
        }

        private onTouchesMoved(touches, event): void {
            if (!touches[0]){ return; }
            var location:Point = <Point>(touches[0].getLocation());
            Input.instance.moveTouch(location);
        }

        private onTouchesEnded(touches, event): void {
            if (!touches[0]){ return; }
            var location:Point = <Point>(touches[0].getLocation());
            Input.instance.endTouch(location);
        }
    }

}

