/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='../game/Game.ts' />
/// <reference path='../game/ResourcePreloader.ts' />
/// <reference path='./core/DatabaseManager.ts' />
/// <reference path='./core/Scene.ts' />
/// <reference path='./ui/AnalogInputController.ts' />
/// <reference path='./ui/AnalogInputIndicator.ts' />
/// <reference path='./map/MapScene.ts' />

module ebi.rpg {

    export class Main {

        public static main(): void {
            ebi.game.Game.run(loop);
        }
        
        private static isInitialized: bool = false;
        private static isPreloadFinishd: bool = false;
        private static scene_: core.Scene = null;

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

            ui.AnalogInputController.update();
            ebi.collision.CollisionSystem.update();

            if (scene_) {
                scene_.update();
            }
        }

        private static init(): void {
            ebi.game.ResourcePreloader.preloadTmx("sample");
            for (var i = 1; i <= 3; i++) {
                // TODO: unload when the scene/map changes
                core.DatabaseManager.loadCharaChipsetData(i);
            }
            ebi.game.ResourcePreloader.preloadTmxImage('tile_a');
            ebi.game.ResourcePreloader.preloadTmxImage('tile_b');
            ebi.game.ResourcePreloader.preloadTmxImage('collision');
            ebi.game.ResourcePreloader.preloadJson("data/event0.json");
            ebi.game.ResourcePreloader.preloadImage("system/normal_baloon_frame");
            ebi.game.ResourcePreloader.preloadImage("system/check_btn_on");
            ebi.game.ResourcePreloader.preloadImage("system/check_btn_off");
            ebi.game.ResourcePreloader.preloadImage("system/analog_base");
            ebi.game.ResourcePreloader.preloadImage("system/analog_stick");
        }

        private static onPreloadFinished(): void {
            if (!scene_) {
                scene_ = new map.MapScene();
                scene_.init();
            }
        }
    }
}
