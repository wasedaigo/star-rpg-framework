/// <reference path='../event/EventObject.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCamera.ts' />
/// <reference path='../map/MapCharacter.ts' />
/// <reference path='../map/MapSensor.ts' />

module ebi.rpg.core {
    export class GameState {
        public static switches: bool[] = [];
        public static map: map.Map;
        public static mapSensor: map.MapSensor;
        public static camera: map.MapCamera;
        public static eventObjects: ebi.rpg.event.EventObject[];

        private static checkCondition(eo: ebi.rpg.event.EventObject, condition: any[]): bool {
        	var result = false;
            switch(condition[0]) {
            	// When "checked" by other event
                case "checked":
                    var eventId: number = condition[1];
                    result = (eo.checkedEventId === eventId);
                break;
                // Check switch condition
                case "switch":
                    var switchNo = condition[1];
                    var boolValue = condition[2];
                    result = switches[switchNo] == (boolValue === 1);
                break;
                // Check switch condition
                case "variable":
                break;
            }
            return result;
        }

        public static checkConditions(eo: ebi.rpg.event.EventObject, conditions: any[][]): bool {
            var len = conditions.length;
            for (var i = 0; i < len; i++) {
                if (!checkCondition(eo, conditions[i])) {
                	return false;
                }
            }

            return true;
        }
    }
}
