/// <reference path='./EventData.ts' />

module ebi.rpg.event {
    export class EventDataLoader {

        private static loadEventStatusData(rawStatus: any): ebi.rpg.event.EventStatusData {
            return {
                visible: (rawStatus[0] == 1),
                alpha: rawStatus[1],
                dir: rawStatus[2],
                frameNo: rawStatus[3],
                chipsetId: rawStatus[4],
                wait: rawStatus[5],
                speed: rawStatus[6],
                layer: rawStatus[7],
                routeRepeat: (rawStatus[8] == 1),
                routeSkip: (rawStatus[9] == 1),
                dirFix: (rawStatus[10] == 1),
                stayAnime: (rawStatus[11] == 1),
                moveAnime: (rawStatus[12] == 1),
                passEvent: (rawStatus[13] == 1),
                passCharacter: (rawStatus[14] == 1),
                passTile: (rawStatus[15] == 1)
            };
        }

        private static loadEventPageData(rawPage: any): ebi.rpg.event.EventPageData {
            var status: ebi.rpg.event.EventStatusData = loadEventStatusData(rawPage[0]);

            var conditions = rawPage[1];
            var route = rawPage[2];
            var commands = rawPage[3];
            var triggers = rawPage[4];

            return {
                status: status,
                route: route,
                conditions: conditions,
                triggers: triggers,
                commands: commands
            };
        }

        private static loadEventData(eventId: number, eventData: any): ebi.rpg.event.EventData {
            var rawPages = eventData[0];
            var eventPages: ebi.rpg.event.EventPageData[] = [];
            rawPages.forEach((rawPage) => {
                eventPages.push(loadEventPageData(rawPage));
            });

            var pos = eventData[1];
            var eventData: EventData = {
                id: eventId,
                pages: eventPages,
                x: pos[0],
                y: pos[1]
            };

            return eventData;
        }

        public static loadEventDataDictionary(mapId: number): {[key : string]: ebi.rpg.event.EventData;} {
            var json = ebi.game.ResourcePreloader.getJson('data/event0.json');
            var events: {[key : string]: ebi.rpg.event.EventData;} = {};
            for (var eventIdKey in json) {
                events[eventIdKey] = loadEventData(parseInt(eventIdKey), json[eventIdKey]);
            }

            return events;
        }
    }
}
