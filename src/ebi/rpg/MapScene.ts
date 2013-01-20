/// <reference path='./Scene.ts' />
/// <reference path='./EventDataLoader.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCamera.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='./AnalogInputIndicator.ts' />

module ebi.rpg {

    export class MapScene extends Scene {

        private map_: Map = null;
        private camera_: MapCamera = null;
        private mapCharacters_: MapCharacter[] = [];
        private analogInputIndicator_: AnalogInputIndicator = null;
        private eventDataDictionary_: {[key : string]: ebi.rpg.EventData;};

        public init(): void {
            this.map_ = new Map();
            this.camera_ = new MapCamera(this.map_);

            var mapCharacter: MapCharacter = new MapCharacter(1, this.map_);
            this.mapCharacters_.push(mapCharacter);
            mapCharacter.setPosition(128, 64);

            var mapCharacter: MapCharacter = new MapCharacter(2, this.map_);
            mapCharacter.setPosition(128, 128);
            mapCharacter.controlable = true;
            this.camera_.focusTarget = mapCharacter;
            this.mapCharacters_.push(mapCharacter);

            var mapCharacter: MapCharacter = new MapCharacter(3, this.map_);
            mapCharacter.setPosition(96, 64);
            this.mapCharacters_.push(mapCharacter);

            this.analogInputIndicator_ = new AnalogInputIndicator();

            this.eventDataDictionary_ = ebi.rpg.EventDataLoader.loadEventData(0);
        }

        public update(): void {
            this.camera_.update();
            this.mapCharacters_.forEach((mapCharacter) => mapCharacter.update());
            this.analogInputIndicator_.update();
        }

    }

}
