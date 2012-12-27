/// <reference path='../game/Game.ts' />

module ebi {
    export module rpg {

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
                    sprite = new ebi.game.Sprite(image);
                }
                sprite.x++;
            }

        }

    }
}
