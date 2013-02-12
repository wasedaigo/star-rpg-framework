/// <reference path='../../game/Text.ts' />GameState

module ebi.rpg.ui {
    export class MessageWindow
     {
        private static Z: number = 1000;
        private static NormalBaloonImage: string = "system/normal_baloon_frame";
        private frameSprites_: ebi.game.Sprite[];
        private arrowSprite_: ebi.game.Sprite;
        private text_: ebi.game.Text;

        private x_: number = 0;
        private y_: number = 0;

        constructor(size: number[]) {
            this.frameSprites_ = [];
            for (var i = 0; i < 9; i++) {
                this.frameSprites_[i] = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(MessageWindow.NormalBaloonImage));
            }
            this.arrowSprite_ = new ebi.game.Sprite(ebi.game.ResourcePreloader.getImage(MessageWindow.NormalBaloonImage));
            this.arrowSprite_.srcX = 12;
            this.arrowSprite_.srcY = 6;
            this.arrowSprite_.srcWidth = 6;  
            this.arrowSprite_.srcHeight = 6; 
            this.arrowSprite_.width = 6; 
            this.arrowSprite_.height = 6; 
            this.arrowSprite_.z = MessageWindow.Z + 0.00001;

            this.x_ = size[0] * 0.5;
            this.y_ = -size[1];

            this.text_ = new ebi.game.Text();
            this.construct(size);
        }

        public dispose(): void {
            this.frameSprites_.forEach((sprite) => sprite.dispose());
            this.arrowSprite_.dispose();
            this.text_.dispose();
        }

        public showText(text: string): void {
            this.text_.text = text;
        }

        public get x(): number {
            return this.x_;
        }

        public set x(value :number) {
            var dx = value - this.x_;
            this.frameSprites_.forEach((sprite) => sprite.x += dx);
            this.text_.x += dx;
            this.arrowSprite_.x += dx; 
            this.x_ = value;

        }

        public get y(): number {
            return this.y_;
        }

        public set y(value :number) {
            var dy = value - this.y_;
            this.frameSprites_.forEach((sprite) => sprite.y += dy);
            this.text_.y += dy;
            this.arrowSprite_.y += dy;
            this.y_ = value;
        }

        private construct(size: number[]): void {
            // Information of how to read source Image
            var patchInfoSrc = [
                [0, 0, 4, 4],
                [4, 0, 4, 4],
                [8, 0, 4, 4],
                [0, 4, 4, 4],
                [4, 4, 4, 4],
                [8, 4, 4, 4],
                [0, 8, 4, 4],
                [4, 8, 4, 4],
                [8, 8, 4, 4]
            ];

            // Information of how to output window
            var bw = 4;
            var bh = 4;
            var tw = size[0];
            var th = size[1];
            var tx = bw + tw;
            var ty = bh + th;
            var patchInfoDst = [
                [0, ty, bw, bh], // Top-Left
                [bw, ty, tw, bh], // Top
                [tx, ty, bw, bh], // Top-Right
                [0, bh, bw, th], // Left
                [bw, bh, tw, th], // Center
                [tx, bh, bw, th], // Right
                [0, 0, bw, bh], // Bottom-Left
                [bw, 0, tw, bh], // Bottom
                [tx, 0, bw, bh]  // Bottom-Right
            ];

            // Update all 9 sprites
            for (var i = 0; i < 9; i++) {
                var sprite = this.frameSprites_[i];
                sprite.srcX      = patchInfoSrc[i][0];
                sprite.srcY      = patchInfoSrc[i][1];
                sprite.srcWidth  = patchInfoSrc[i][2]; 
                sprite.srcHeight = patchInfoSrc[i][3]; 
                sprite.x         = patchInfoDst[i][0]; 
                sprite.y         = patchInfoDst[i][1];
                sprite.width     = patchInfoDst[i][2];
                sprite.height    = patchInfoDst[i][3];
                sprite.z         = MessageWindow.Z;
            }

            this.arrowSprite_.x = bw + tw / 2;
            //TODO: Sprite class should implement setter/getter for anchor
            this.arrowSprite_.y = -6 + 2;

            // Update content text
            this.text_.width = tw;
            this.text_.height = th;
            this.text_.x = 0;
            this.text_.y = 0;
            this.text_.z = MessageWindow.Z;
        }
    }
}
