/// <reference path='../game/Game.ts' />
/// <reference path='../game/Input.ts' />
/// <reference path='./MapCharacter.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            init();
            ebi.game.Game.run(loop);
        }
        
        private static sprite: ebi.game.Sprite = null;
        private static mapCharacter: MapCharacter = null;

        private static loop(): void {
            if (mapCharacter){
                if (ebi.game.Input.isTouched) {
                    mapCharacter.update();
                }
            }
        }

        private static init(): void {
            ebi.game.Image.load('res/images/characters/chara01.png', (loadedImage) => {
                mapCharacter = new MapCharacter(loadedImage);
            });
        }
    }
}
