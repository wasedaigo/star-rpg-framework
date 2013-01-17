/// <reference path='./Scene.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCamera.ts' />
/// <reference path='./MapCharacter.ts' />

module ebi.rpg {

    export class MapScene extends Scene {

        private map_: Map = null;
        private mapCharacters_: MapCharacter[] = [];

        public init(): void {
            this.map_ = new Map();

            var mapCharacter: MapCharacter = new MapCharacter(1, this.map_);
            this.mapCharacters_.push(mapCharacter);
            mapCharacter.setPosition(128, 64);

            var mapCharacter: MapCharacter = new MapCharacter(2, this.map_);
            mapCharacter.setPosition(128, 128);
            mapCharacter.controlable = true;
            this.mapCharacters_.push(mapCharacter);
            MapCamera.focusTarget = mapCharacter;

            var mapCharacter: MapCharacter = new MapCharacter(3, this.map_);
            mapCharacter.setPosition(96, 64);
            this.mapCharacters_.push(mapCharacter);
        }

        public update(): void {
            MapCamera.update();
            this.mapCharacters_.forEach((mapCharacter) => mapCharacter.update());
        }

    }

}
