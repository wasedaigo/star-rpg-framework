module ebi.rpg.event {
    export class ConditionChecker {
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
