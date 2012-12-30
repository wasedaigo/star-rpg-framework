/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    /*
     * Input
     */
    export class Input {
        private static isTouched_: bool      = false;
        private static isNewlyTouched_: bool = false;
        private static touchX_: number       = 0;
        private static touchY_: number       = 0;
        private static lastAction_: string   = ''; // TODO: This should be an enum

        public static get isTouched(): bool {
            return isTouched_;
        }

        public static get isNewlyTouched(): bool {
            return isNewlyTouched_;
        }

        public static get touchX(): number {
            return touchX_;
        }

        public static get touchY(): number {
            return touchY_;
        }

        public static beginTouch(touchX: number, touchY: number): void {
            touchX_     = touchX;
            touchY_     = touchY;
            isTouched_  = true;
            lastAction_ = 'touchBegan';
        }

        public static moveTouch(touchX: number, touchY: number): void {
            touchX_     = touchX;
            touchY_     = touchY;
            lastAction_ = 'touchMoved';
        }

        public static endTouch(touchX: number, touchY: number): void {
            touchX_     = touchX;
            touchY_     = touchY;
            lastAction_ = 'touchEnded';
            isTouched_  = false;
        }

        public static update(): void {
            // Set the flag if the screen was taped at this frame
            isNewlyTouched_ = false;
            if (lastAction_ === 'touchBegan') {
                isNewlyTouched_ = true;
            }
            lastAction_ = '';
        }
    }
}
