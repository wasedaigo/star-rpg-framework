/// <reference path='../game/Game.ts' />
/// <reference path='../game/Input.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./ImageManager.ts' />
/// <reference path='./MapCharacter.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            init();
            ebi.game.Game.run(loop);
        }
        
        private static sprite: ebi.game.Sprite = null;
        private static mapCharacters: MapCharacter[] = [];
        private static isPreloadFinishd: bool = false;

        private static loop(): void {
            if (ImageManager.isLoading()){
                if (!isPreloadFinishd) {
                    onPreloadFinished();
                }

                if (ebi.game.Input.isTouched) {
                    mapCharacters.forEach((mapCharacter) => mapCharacter.update());
                }
            }
        }

        private static onPreloadFinished(): void {
            var mapCharacter: MapCharacter = new MapCharacter(1);
            mapCharacters.push(mapCharacter);
            var mapCharacter: MapCharacter = new MapCharacter(2);
            mapCharacter.y = 60;
            mapCharacters.push(mapCharacter);
            var mapCharacter: MapCharacter = new MapCharacter(3);
            mapCharacter.y = 120;
            mapCharacters.push(mapCharacter);
            isPreloadFinishd = true;
        }

        private static init(): void {
            for (var i = 1; i <= 3; i++) {
                var charaChipsetData = DatabaseManager.getCharaChipsetData(i);
                ImageManager.preloadImage(charaChipsetData.srcImage);
            }
        }
    }
}
