module ebi.rpg.event {
    export interface EventStatusData {
        visible: bool;
        alpha: number;
        dir: number;
        frameNo: number;
        chipsetId: number;
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
        conditions: Object[][];
        triggers: Object[];
        commands: Object[];
        route: Object[];
    }

    export interface EventData {
        id: number;
        pages: EventPageData[];
        x: number;
        y: number;
    }
}
