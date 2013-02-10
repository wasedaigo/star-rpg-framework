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
/// <reference path='../core/GameState.ts' />

module ebi.rpg.map {

    export class MapScene extends rpg.core.Scene {
        private analogInputIndicator_: ui.AnalogInputIndicator = null;

        public init(): void {
            core.GameState.map = new Map();
            core.GameState.camera = new MapCamera(core.GameState.map);
            core.GameState.mapSensor = new MapSensor();
            var eventObjects = [];
            var eventDataDictionary = rpg.event.EventDataLoader.loadEventDataDictionary(0);
            for (var key in eventDataDictionary) {
                var eventData = eventDataDictionary[key];
                var eo = new event.EventObject(eventData);
                eventObjects[eventData.id] = eo;
            }

            core.GameState.eventObjects = eventObjects;
            core.GameState.camera.focusTarget = this.playerEvent.mapCharacter;

            // Initialize UI
            this.analogInputIndicator_ = new ui.AnalogInputIndicator();
            
            var messageWindow = new ui.MessageWindow([100, 50]);
            messageWindow.x = 100;
            messageWindow.y = 300;
            messageWindow.showText("私は\nだいごです");
        }

        public update(): void {
            core.GameState.camera.update();

            // Update EventPage, such as checking existing condition
            for (var key in core.GameState.eventObjects) {
                core.GameState.eventObjects[key].update();
            }

            // Reset its state
            for (var key in core.GameState.eventObjects) {
                core.GameState.eventObjects[key].reset();
            }

            // Check MapEvents
            if (ui.AnalogInputController.isChecked) {
                core.GameState.mapSensor.check(this.playerEvent);
            }

            this.analogInputIndicator_.update();
        }

        private get playerEvent(): event.EventObject {
            return core.GameState.eventObjects["0"];
        }

    }

}
