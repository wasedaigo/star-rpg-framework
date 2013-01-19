/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='../game/Game.ts' />
/// <reference path='../game/ResourcePreloader.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./AnalogInputController.ts' />
/// <reference path='./AnalogInputIndicator.ts' />
/// <reference path='./MapScene.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            ebi.game.Game.run(loop);
        }
        
        private static isInitialized: bool = false;
        private static isPreloadFinishd: bool = false;
        private static scene_: Scene = null;

        private static loop(): void {
            if (!isInitialized) {
                init();
                isInitialized = true;
            }
            if (ebi.game.ResourcePreloader.isLoading) {
                return;
            }
            if (!isPreloadFinishd) {
                onPreloadFinished();
                isPreloadFinishd = true;
            }

            AnalogInputController.update();
            ebi.collision.CollisionSystem.update();

            if (scene_) {
                scene_.update();
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

            // TODO organize a way to preload assets
            AnalogInputIndicator.preload();
        }

        private static onPreloadFinished(): void {
            if (!scene_) {
                scene_ = new MapScene();
                scene_.init();
            }
        }
    }
}
