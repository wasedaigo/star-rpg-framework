/// <reference path='../../game/Input.ts' />
module ebi.rpg.ui {
    export class ActionButton
     {
        private static Z: number = 1000;
        private static CheckBtnOnImage: string = "system/check_btn_on";
        private static CheckBtnOffImage: string = "system/check_btn_off";
        private checkButtonOn_: ebi.game.Sprite = null;
        private checkButtonOff_: ebi.game.Sprite = null;

        constructor() {
            this.checkButtonOn_  = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(ActionButton.CheckBtnOnImage));
            this.checkButtonOff_ = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(ActionButton.CheckBtnOffImage));
            this.checkButtonOn_.z = ActionButton.Z;
            this.checkButtonOff_.z = ActionButton.Z;
            this.checkButtonOn_.setVisible(false);
        }

        public get x(): number {
            return this.checkButtonOn_.x;
        }

        public set x(value: number) {
            this.checkButtonOn_.x = value;
            this.checkButtonOff_.x = value;
        }

        public get y(): number {
            return this.checkButtonOn_.y;
        }

        public set y(value: number) {
            this.checkButtonOn_.y = value;
            this.checkButtonOff_.y = value;
        }

        public update(): void {
            this.checkButtonOn_.setVisible(false);
            this.checkButtonOff_.setVisible(true); 
            if (ebi.game.Input.isTouched) {
                var tx = ebi.game.Input.touchX;
                var ty = ebi.game.Input.touchY;
                var dx = tx - this.x;
                var dy = ty - this.y;
                if (0 <= dx && dx <= 64 && 0 <= dy && dy <= 64) {
                    this.checkButtonOn_.setVisible(true);
                    this.checkButtonOff_.setVisible(false);
                }
            }
        }
    }
}
