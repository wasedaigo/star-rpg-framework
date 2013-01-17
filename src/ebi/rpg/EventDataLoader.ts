/// <reference path='../game/ResourcePreloader.ts' />

module ebi.rpg {
    export interface EventStatusData {
        visible: bool;
        alpha: number;
        dir: number;
        frameNo: number;
        chipId: number;
        wait: number;
        speed: number;
        layer: number;
        routeRepeat: bool;
        routeSkip: bool;
        dirFix: bool;
        stayAnime: bool;
        moveAnime: bool;
        passEvent: bool;
        passCharacter: bool;
        passTile: bool;
    }

    export interface EventPageData {
        status: EventStatusData;
        conditions: any[];
        triggers: any[];
        commands: any[];
        route: any[];
    }

    export interface EventData {
        pages: EventPageData[];
        pos: number[];
    }

    export class EventDataLoader {
        public static loadEventData(mapId: number): {[key : string]: ebi.rpg.EventData;} {
            var json = ebi.game.ResourcePreloader.getJson('data/event0.json');
            var events: {[key : string]: ebi.rpg.EventData;} = {};
            for (var eventId in json) {
                var eventPages: ebi.rpg.EventPageData[] = [];
                var rawPages = json[eventId][0];
                rawPages.forEach((rawPage) => {
                    var rawStatus = rawPage[0];
                    var status: ebi.rpg.EventStatusData = {
                        visible: (rawStatus[0] == 1),
                        alpha: rawStatus[1],
                        dir: rawStatus[2],
                        frameNo: rawStatus[3],
                        chipId: rawStatus[4],
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

                    var conditions = rawPages[1];
                    var route = rawPages[2];
                    var commands = rawPages[3];
                    var triggers = rawPages[4];

                    eventPages.push({
                        status: status,
                        route: route,
                        conditions: conditions,
                        triggers: triggers,
                        commands: commands
                    });
                });

                var pos = json[eventId][1];
                var eventData: EventData = {
                    pages: eventPages,
                    pos: pos
                };
                events[eventId] = eventData;
            }

            return events;
        }
    }
}