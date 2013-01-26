/// <reference path='./AnalogInputController.ts' />
module ebi.rpg.ui {
    export class AnalogInputIndicator
     {
        private static StickRadius: number = 12;
        private static BarImage: string = "system/analog_base";
        private static StickImage: string = "system/analog_stick";
        private base_: ebi.game.Sprite = null;
        private stick_: ebi.game.Sprite = null;

        constructor() {
            this.base_ = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(AnalogInputIndicator.BarImage));
            this.stick_ = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(AnalogInputIndicator.StickImage));
        }

        public update(): void {
            var dx = AnalogInputController.inputDx * AnalogInputIndicator.StickRadius;
            var dy = AnalogInputController.inputDy * AnalogInputIndicator.StickRadius;
            this.base_.x = AnalogInputController.touchX - this.base_.srcWidth / 2;
            this.base_.y = AnalogInputController.touchY - this.base_.srcHeight / 2;
            this.stick_.x = AnalogInputController.touchX - this.stick_.srcWidth / 2 + dx;
            this.stick_.y = AnalogInputController.touchY - this.stick_.srcHeight / 2 + dy;

            if (AnalogInputController.isTouched) {
                this.base_.setVisible(true);
                this.stick_.setVisible(true);
            } else {
                this.base_.setVisible(false);
                this.stick_.setVisible(false);
            }
        }

        public static preload(): void {
            ebi.game.ResourcePreloader.preloadImage(AnalogInputIndicator.BarImage);
            ebi.game.ResourcePreloader.preloadImage(AnalogInputIndicator.StickImage);
        }
    }
}
