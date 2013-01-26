/// <reference path='../core/Scene.ts' />
/// <reference path='../event/EventDataLoader.ts' />
/// <reference path='../ui/AnalogInputIndicator.ts' />
/// <reference path='../ui/MessageWindow.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCamera.ts' />
/// <reference path='./MapCharacter.ts' />

module ebi.rpg.map {

    export class MapScene extends rpg.core.Scene {
        private map_: Map = null;
        private camera_: MapCamera = null;
        private mapCharacters_: MapCharacter[] = [];
        private analogInputIndicator_: rpg.ui.AnalogInputIndicator = null;
        private eventDataDictionary_: {[key : string]: rpg.event.EventData;};

        public init(): void {
            this.map_ = new Map();
            this.camera_ = new MapCamera(this.map_);

            var mapCharacter: MapCharacter = new MapCharacter(1, this.map_);
            this.mapCharacters_.push(mapCharacter);
            mapCharacter.setPosition(132, 64);

            var mapCharacter: MapCharacter = new MapCharacter(2, this.map_);
            mapCharacter.setPosition(128, 128);
            mapCharacter.controlable = true;
            this.camera_.focusTarget = mapCharacter;
            this.mapCharacters_.push(mapCharacter);
            mapCharacter.ignoreTile = false;
            mapCharacter.ignoreCharacter = false;
            mapCharacter.ignoreTrigger = false;

            var mapCharacter: MapCharacter = new MapCharacter(3, this.map_);
            mapCharacter.setPosition(96, 64);
            this.mapCharacters_.push(mapCharacter);

            this.analogInputIndicator_ = new rpg.ui.AnalogInputIndicator();

            this.eventDataDictionary_ = rpg.event.EventDataLoader.loadEventData(0);
            var messageWindow = new rpg.ui.MessageWindow([100, 50]);
            messageWindow.x = 100;
            messageWindow.y = 200;
            messageWindow.showText("私は\nだいごです");
        }

        public update(): void {
            this.camera_.update();
            this.mapCharacters_.forEach((mapCharacter) => mapCharacter.update());
            this.analogInputIndicator_.update();
        }

    }

}
