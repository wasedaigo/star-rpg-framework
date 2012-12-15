/// <reference path='../game/Game.ts' />

module ebi {
    export module rpg {

        export class Main {
            public static main(): void {
                var image: ebi.game.Image = null;
                ebi.game.Game.run(function () {
                    if (!image) {
                        ebi.game.Image.load('res/images/game/title.png', function(loadedImage) {
                            image = loadedImage;
                        });
                    }
                });
            }
        }

    }
}
