/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    export module game {

        /*
         * Input
         */
        export class Input {
            private static isTouched_: bool      = false;
            private static isNewlyTouched_: bool = false;
            private static location_: Point      = new Point(0, 0);
            private static lastAction_: string   = ""; // TODO: This should be an enum

            public static get isTouched(): bool {
                return isTouched_;
            }

            public static get isNewlyTouched(): bool {
                return isNewlyTouched_;
            }

            public static get location(): Point {
                return location_;
            }

            public static beginTouch(location: Point) {
                location_   = location;
                isTouched_  = true;
                lastAction_ = "touchBegan";
            }

            public static moveTouch(location: Point) {
                location_   = location;
                lastAction_ = "touchMoved";
            }

            public static endTouch(location: Point) {
                location_   = location;
                lastAction_ = "touchEnded";
                isTouched_  = false;
            }

            public static update(): void {
                // Set the flag if the screen was taped at this frame
                isNewlyTouched_ = false;
                if (lastAction_ === "touchBegan") {
                    isNewlyTouched_ = true;
                }
                lastAction_ = "";
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

}
