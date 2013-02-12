module ebi.rpg.event {
    export class EventRouteController {
        private routeCommands_: any[];
        private skipWhenCollide_: bool;
        private repeat_: bool;
        private routeIndex_: number;

        constructor(routeCommands: any[], skipWhenCollide: bool, repeat: bool) {
            this.routeCommands_ = routeCommands;
            this.skipWhenCollide_ = skipWhenCollide;
            this.repeat_ = repeat;
        }

        public update(): void {
            // Progress route and execute action
            //this.routeIndex_++;
        }
    }
}
