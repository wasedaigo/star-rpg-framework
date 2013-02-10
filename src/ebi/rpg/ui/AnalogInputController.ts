module ebi.rpg.ui {
    export class AnalogInputController {
        private static MinInputValue: number = 8; // Logical Pixels
        private static MaxInputValue: number = 48; // Logical Pixels

        private static isAnalogControlMode_: bool = false;
        private static touchStartLocationX_: number;
        private static touchStartLocationY_: number;
        private static inputDx_: number; // 0.0 ~ 1.0
        private static inputDy_: number; // 0.0 ~ 1.0
        private static isChecked_: bool;

        public static update(): void {
            isChecked_ = false;
            inputDx_ = 0;
            inputDy_ = 0;
            if (ebi.game.Input.isNewlyTouched) {
                touchStartLocationX_ = ebi.game.Input.touchX;
                touchStartLocationY_ = ebi.game.Input.touchY;
            }

            if (ebi.game.Input.isTouched) {
                var dx: number = ebi.game.Input.touchX - touchStartLocationX_;
                var dy: number = ebi.game.Input.touchY - touchStartLocationY_;

                if ((dx * dx + dy * dy) > MinInputValue * MinInputValue) {
                    isAnalogControlMode_ = true;
                    inputDx_ = ebi.cropValue(dx, 0, MaxInputValue) / MaxInputValue;
                    inputDy_ = ebi.cropValue(dy, 0, MaxInputValue) / MaxInputValue;          
                }
            }

            if (ebi.game.Input.isTouchFinished) {
                if(!isAnalogControlMode_) {
                    isChecked_ = true;
                }
                isAnalogControlMode_ = false;
            }
        }

        public static get inputDx(): number {
            return inputDx_;
        }

        public static get inputDy(): number {
            return inputDy_;
        }

        public static get isChecked(): bool {
            return isChecked_;
        }

        public static get isAnalogControlMode(): bool {
            return isAnalogControlMode_;
        }

        public static get touchX(): number {
            return touchStartLocationX_;
        }

        public static get touchY(): number {
            return touchStartLocationY_;
        }
    }
}
