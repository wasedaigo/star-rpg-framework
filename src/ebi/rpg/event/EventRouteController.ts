module ebi.rpg.event {
    export class EventRouteController {
        private eventObject_: EventObject = null;
        private routeCommands_: any[] = [];
        private skipWhenCollide_: bool = false;
        private repeat_: bool = false;
        private routeIndex_: number = 0;
        private waitForAction_: bool = false;

        constructor(eo: EventObject, routeCommands: any[], skipWhenCollide: bool, repeat: bool) {
            this.eventObject_ = eo;
            this.routeCommands_ = routeCommands;
            this.skipWhenCollide_ = skipWhenCollide;
            this.repeat_ = repeat;
        }

        public update(): void {
            var commandCount = this.routeCommands_.length;

            if (this.routeIndex_ >= commandCount) {
                return;
            }

            if (this.waitForAction_) {
                return;
            }

            var command = this.routeCommands_[this.routeIndex_];
            switch(command[0]) {
                case "move_up":
                    var distance: number = command[1];
                    this.waitForAction_ = true;
                    this.eventObject_.mapCharacter.move(0, distance, this.moveFinished.bind(this));
                break;
                case "move_down":
                    var distance: number = command[1];
                    this.waitForAction_ = true;
                    this.eventObject_.mapCharacter.move(0, -distance, this.moveFinished.bind(this));
                break;
            }
            this.routeIndex_++;

            if (this.repeat_ && this.routeIndex_ >= commandCount) {
                // Repeat command if it reaches the end
                this.routeIndex_ = 0;
            }
        }

        private moveFinished(): void {
            this.waitForAction_ = false;
        }
    }
}
