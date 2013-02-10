/// <reference path='../core/Scene.ts' /
/// <reference path='../event/EventDataLoader.ts' />
/// <reference path='../event/EventObject.ts' />
/// <reference path='../ui/AnalogInputController.ts' />
/// <reference path='../ui/AnalogInputIndicator.ts' />
/// <reference path='../ui/MessageWindow.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCamera.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='./MapSensor.ts' />

module ebi.rpg.map {

    export class MapScene extends rpg.core.Scene {
        private map_: Map;
        private mapSensor_: MapSensor;
        private camera_: MapCamera;
        private eventObjects_: event.EventObject[] = [];
        private analogInputIndicator_: ui.AnalogInputIndicator = null;

        private eventDataDictionary_: {[key : string]: rpg.event.EventData;};

        public init(): void {
            this.map_ = new Map();
            this.camera_ = new MapCamera(this.map_);
            this.mapSensor_ = new MapSensor();

            this.eventDataDictionary_ = rpg.event.EventDataLoader.loadEventDataDictionary(0);
            for (var key in this.eventDataDictionary_) {
                var eventData = this.eventDataDictionary_[key];
                var eo = new event.EventObject(this.map_, eventData);
                this.eventObjects_.push(eo);
            }
            this.camera_.focusTarget = this.playerEvent.mapCharacter;

            // Initialize UI
            this.analogInputIndicator_ = new ui.AnalogInputIndicator();
            
            var messageWindow = new ui.MessageWindow([100, 50]);
            messageWindow.x = 100;
            messageWindow.y = 300;
            messageWindow.showText("私は\nだいごです");
        }

        public update(): void {
            this.camera_.update();
            this.eventObjects_.forEach((eo) => eo.updatePage());
            this.eventObjects_.forEach((eo) => eo.updateCommand());
            this.eventObjects_.forEach((eo) => eo.updateMapCharacter());
            this.analogInputIndicator_.update();
            if (ui.AnalogInputController.isChecked) {
                this.mapSensor_.check(this.playerEvent);
            }
        }

        private get playerEvent(): event.EventObject {
            return this.eventObjects_[0];
        }

    }

}
