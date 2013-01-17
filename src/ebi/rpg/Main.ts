/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='../game/Game.ts' />
/// <reference path='../game/Input.ts' />
/// <reference path='../game/ResourcePreloader.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCamera.ts' />
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
        private static map_: Map = null;

        private static loop(): void {
            if (!isInitialized) {
                init();
                isInitialized = true;
            }
            if (!ebi.game.ResourcePreloader.isLoading) {
                if (!isPreloadFinishd) {
                    onPreloadFinished();
                    isPreloadFinishd = true;
                }

                mapCharacters.forEach((mapCharacter) => mapCharacter.update());
                AnalogInputController.update();
                MapCamera.update();

                ebi.collision.CollisionSystem.update();
            }
        }

        private static init(): void {
            ebi.game.ResourcePreloader.preloadTmx("sample");
            for (var i = 1; i <= 3; i++) {
                // TODO: unload when the scene/map changes
                DatabaseManager.loadCharaChipsetData(i);
            }
            ebi.game.ResourcePreloader.preloadTmxImage('tile_a');
            ebi.game.ResourcePreloader.preloadTmxImage('tile_b');
            ebi.game.ResourcePreloader.preloadTmxImage('collision');
        }

        private static onPreloadFinished(): void {
            map_ = new Map();

            var mapCharacter: MapCharacter = new MapCharacter(1, map_);
            mapCharacters.push(mapCharacter);
            mapCharacter.setPosition(128, 64);

            var mapCharacter: MapCharacter = new MapCharacter(2, map_);
            mapCharacter.setPosition(128, 128);
            mapCharacter.controlable = true;
            mapCharacters.push(mapCharacter);
            MapCamera.focusTarget = mapCharacter;

            var mapCharacter: MapCharacter = new MapCharacter(3, map_);
            mapCharacter.setPosition(96, 64);
            mapCharacters.push(mapCharacter);
        }
    }
}
