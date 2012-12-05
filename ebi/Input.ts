/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    /*
     * Input: Singleton class
     */
    export class Input {
        private static _isTouched: bool      = false;
        private static _isNewlyTouched: bool = false;
        private static _location: Point      = new Point(0, 0);
        private static _lastAction: string   = "";

        public static get isTouched(): bool {
            return _isTouched;
        }

        public static get isNewlyTouched(): bool {
            return _isNewlyTouched;
        }

        public static get location(): Point {
            return _location;
        }

        public static beginTouch(location: Point) {
            _location   = location;
            _isTouched  = true;
            _lastAction = "touchBegan";
        }

        public static moveTouch(location: Point) {
            _location   = location;
            _lastAction = "touchMoved";
        }

        public static endTouch(location: Point) {
            _location   = location;
            _lastAction = "touchEnded";
            _isTouched  = false;
        }

        public static update(): void {
            // Set the flag if the screen was taped at this frame
            _isNewlyTouched = false;
            if (_lastAction === "touchBegan") {
                _isNewlyTouched = true;
            }
            _lastAction = "";
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
            Input.beginTouch(location);
        }

        private onTouchesMoved(touches, event): void {
            if (!touches[0]){ return; }
            var location:Point = <Point>(touches[0].getLocation());
            Input.moveTouch(location);
        }

        private onTouchesEnded(touches, event): void {
            if (!touches[0]){ return; }
            var location:Point = <Point>(touches[0].getLocation());
            Input.endTouch(location);
        }
    }

}

