/// <reference path='../game/Game.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./ResourceManager.ts' />

module ebi.rpg {
    export class MapCharacter {
        // TODO: Rename it
        private a_: number = 1;
        private frameCount_: number = 1;
        private dir_: number = 0;
        private timer_: number = 0;
        private sprite_: ebi.game.Sprite = null;
        // TODO: I suggest to create the new class named CharaChipsetData.
        private charaChipsetData_: Object;

        constructor(id: number) {
            this.charaChipsetData_ = DatabaseManager.getCharaChipsetData(id);
            var image = ResourceManager.getImage(this.charaChipsetData_['srcImage']);
            var data = this.charaChipsetData_;
            this.frameCount_ = data['startAnim'];
            this.dir_ = data['startDir'];
            this.sprite_ = new ebi.game.Sprite(image);
            this.sprite_.srcX      = (data['charaX'] * data['animCount'] + this.frameCount_) * data['srcWidth'];
            this.sprite_.srcY      = (data['charaY'] * data['dirCount'] + this.dir_) * data['srcHeight'];
            this.sprite_.srcWidth  = data['srcWidth'];
            this.sprite_.srcHeight = data['srcHeight'];
        }

        // x
        public get x(): number {
            return this.sprite_.x;
        }
        public set x(value: number) {
            this.sprite_.x = value;
        }

        // y
        public get y(): number {
            return this.sprite_.y;
        }
        public set y(value: number) {
            this.sprite_.y = value;
        }

        public update(): void {
            this.sprite_.x += 1;

            this.timer_++;
            if (this.timer_ > 10) {
                this.timer_ = 0;
                this.frameCount_ += this.a_;

                // ----> switching the animation to the right
                if (this.frameCount_ >= this.charaChipsetData_['animCount'] - 1) {
                    this.frameCount_ = this.charaChipsetData_['animCount'] - 1;
                    this.a_ = -1;
                }

                // <---- switching the animation to the left
                if (this.frameCount_ <= 0) {
                    this.frameCount_ = 0;
                    this.a_ = 1;
                }
            }

            var data = this.charaChipsetData_;

            // Update animation frame
            this.sprite_.srcX = (data['charaX'] * data['animCount'] + this.frameCount_) * data['srcWidth'];

            // Update animation dir
            this.sprite_.srcY = (data['charaY'] * data['dirCount'] + this.dir_) * data['srcHeight'];
        }
    }
}
