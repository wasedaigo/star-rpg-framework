/// <reference path='../game/Game.ts' />
/// <reference path='../game/Input.ts' />
/// <reference path='../game/TmxTiledMap.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./ResourceManager.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='./AnalogInputController.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            ebi.game.Game.run(loop);
        }
        
        private static sprite: ebi.game.Sprite = null;
        private static mapCharacters: MapCharacter[] = [];
        private static isInitialized: bool = false;
        private static isPreloadFinishd: bool = false;

        private static loop(): void {
            if (!isInitialized) {
                init();
                isInitialized = true;
            }
            if (!ResourceManager.isLoading()){
                if (!isPreloadFinishd) {
                    onPreloadFinished();
                    isPreloadFinishd = true;
                }

                mapCharacters.forEach((mapCharacter) => mapCharacter.update());
                AnalogInputController.update();
            }
        }

        private static init(): void {
            ResourceManager.preloadTmx("sample");
            for (var i = 1; i <= 3; i++) {
                var charaChipsetData = DatabaseManager.getCharaChipsetData(i);
                ResourceManager.preloadImage(charaChipsetData['srcImage']);
            }
            ResourceManager.preloadTmxImage('tile_a');
            ResourceManager.preloadTmxImage('tile_b');
        }

        private static onPreloadFinished(): void {
            ebi.game.TmxTiledMap.loadMap("sample");

            var mapCharacter: MapCharacter = new MapCharacter(1);
            mapCharacters.push(mapCharacter);
            var mapCharacter: MapCharacter = new MapCharacter(2);
            mapCharacter.y = 60;
            mapCharacters.push(mapCharacter);
            var mapCharacter: MapCharacter = new MapCharacter(3);
            mapCharacter.y = 120;
            mapCharacters.push(mapCharacter);
        }
    }
}
