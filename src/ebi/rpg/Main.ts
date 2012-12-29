/// <reference path='../game/Game.ts' />
/// <reference path='../game/Input.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            ebi.game.Game.run(loop);
        }

        private static image: ebi.game.Image = null;
        private static sprite: ebi.game.Sprite = null;

        private static loop(): void {
            if (!image) {
                ebi.game.Image.load('res/images/game/title.png', (loadedImage) => {
                    image = loadedImage;
                    console.log('loaded!');
                });
            }
            if (!sprite) {
                sprite = new ebi.game.Sprite(image, {srcX:50, srcY:50, srcWidth:50, srcHeight:50});
            }

            if (ebi.game.Input.isTouched) {
                sprite.x++;
                console.log(ebi.game.Input.touchX + ", " + ebi.game.Input.touchY);
            }
        }

    }

}
