module ebi.rpg.event {
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
        x: number;
        y: number;
    }
}
