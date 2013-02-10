/// <reference path='../event/EventObject.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCamera.ts' />
/// <reference path='../map/MapCharacter.ts' />
/// <reference path='../map/MapSensor.ts' />

module ebi.rpg.core {
    export class GameState {
        public static map: map.Map;
        public static mapSensor: map.MapSensor;
        public static camera: map.MapCamera;
        public static eventObjects: {[key : string]: ebi.rpg.event.EventObject;};

        private static checkCondition(condition: Object[]): bool {
        	var result = false;
            switch(condition[0]) {
            	// When "checked" by other event
                case "checked":
                    var eventId = condition[1];
                    result = false;
                break;
                // Check switch condition
                case "switch":
                    var switchNo = condition[1];
                    var value = condition[2];
                    result = (value === 1);
                break;
                // Check switch condition
                case "variable":
                break;
            }
            return result;
        }

        public static checkConditions(conditions: Object[][]): bool {
            var len = conditions.length;
            for (var i = 0; i < len; i++) {
                if (!checkCondition(conditions[i])) {
                	return false;
                }
            }

            return true;
        }
    }
}
