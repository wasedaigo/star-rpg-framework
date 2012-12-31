module ebi.rpg {
    export class AnalogInputController {
        private static MinInputValue: number = 16; // Logical Pixels
        private static MaxInputValue: number = 64; // Logical Pixels

        private static touchStartLocationX_: number;
        private static touchStartLocationY_: number;
        private static inputDx_: number;
        private static inputDy_: number;

        // value less than min will be invalid
        // value more than max will be rounded to max
        // This function handles both positive/negative case
        private static roundValue(value, min, max): number {

            if (value > 0) {
                value = value < min ? 0: value;
                value = value > max ? max: value;
            } else {
                value = value > min ? 0: value;
                value = value < -max ? -max: value;
            }

            return value;
        }

        public static update(): void {
            inputDx_ = 0;
            inputDy_ = 0;
            if (ebi.game.Input.isNewlyTouched) {
                touchStartLocationX_ = ebi.game.Input.touchX;
                touchStartLocationY_ = ebi.game.Input.touchY;
            }

            if (ebi.game.Input.isTouched) {
                var dx: number = ebi.game.Input.touchX - touchStartLocationX_;
                var dy: number = ebi.game.Input.touchY - touchStartLocationY_;

                inputDx_ = roundValue(dx, MinInputValue, MaxInputValue) / MaxInputValue;
                inputDy_ = roundValue(-dy, MinInputValue, MaxInputValue) / MaxInputValue;
            }
        }

        public static get inputDx(): number {
            return inputDx_;
        }

        public static get inputDy(): number {
            return inputDy_;
        }

        public static get hasInput(): bool {
            return inputDx_ != 0 || inputDy_ != 0;
        }
    }
}
