/// <reference path='../core/GameState.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCharacter.ts' />
/// <reference path='./EventData.ts' />
/// <reference path='./ui/AnalogInputController.ts' />

module ebi.rpg.event {
    export class EventObject {
        private mapCharacter_: map.MapCharacter = null;
        private pageIndex_: number = -1;
        private eventData_: EventData = null;
        private checkedEventId_: number = -1;
        private touchedEventId_: number = -1;
        private commandExecuting_: bool = false;
        private commandIndex_: number = 0;

        constructor(eventData: EventData) {
            this.eventData_ = eventData;
            // Setup Default MapCharacter (Invisible / Non-Interactive)
            this.mapCharacter_ = new rpg.map.MapCharacter(this, core.GameState.map);
            this.mapCharacter_.setPosition(eventData.x, eventData.y);
            this.mapCharacter_.ignoreTile = true;
            this.mapCharacter_.ignoreCharacter = true;
            this.mapCharacter_.ignoreTrigger = true;
            this.mapCharacter_.controlable = (eventData.id === 0);   
        }

        public get mapCharacter(): map.MapCharacter {
            return this.mapCharacter_;
        }

        public get eventId(): number {
            return this.eventData_.id;
        }

        public get checkedEventId(): number {
            return this.checkedEventId_;
        }

        public get touchedEventId(): number {
            return this.touchedEventId_;
        }

        private get currentPage(): event.EventPageData {
            return this.eventData_.pages[this.pageIndex_];
        }

        public update(): void {
            this.updatePage();
            this.checkTrigger();
            this.updateCommand();


            if (!core.GameState.pauseMovement) { 
                this.mapCharacter_.update();
            }
            
        }

        public reset(): void {
            this.touchedEventId_ = -1;
            this.checkedEventId_ = -1;
        }

        public check(eventId: number): void {
            console.log("Event(" + this.eventId + ") is checked by Event(" + eventId + ")");
            this.checkedEventId_ = eventId;
        }

        public touch(eventId: number): void {
            console.log("Event(" + this.eventId + ") is touched by Event(" + eventId + ")");
            this.touchedEventId_ = eventId;
        }

        private updatePage(): void {
            var index = this.getActiveTopPageIndex();
            this.setPageIndex(index);
        }

        private updateCommand(): void {
            if (this.commandExecuting_) {
                var commands = this.currentPage.commands;
                var len = commands.length;
                while (true) {
                    var command = commands[this.commandIndex_];
                    var commandType: string = command[0];
                    var breakPoint = false;
                    switch(commandType) {
                        case "message":
                            if (core.GameState.messageWindowController.isShowingMessage()) {
                                if (ui.AnalogInputController.isChecked) {
                                    ui.AnalogInputController.cancelCheck();
                                    core.GameState.messageWindowController.hideMessage();
                                    core.GameState.pauseMovement = false;
                                } else {
                                    breakPoint = true;
                                }
                            } else {
                                var text = command[1];
                                core.GameState.messageWindowController.showMessage(this.mapCharacter, text);
                                core.GameState.pauseMovement = true;
                                breakPoint = true;
                            }
                        break;
                        case "switch": 
                            var switchNo = command[1];
                            var boolValue = command[2];
                            core.GameState.switches[switchNo] = (boolValue === 1);
                        break;
                    }

                    // Break and not progress command index
                    if (breakPoint) {
                        break;
                    }

                    // Move to next line
                    this.commandIndex_++;

                    // Line reached to the end, event command is finished
                    if (this.commandIndex_ >= len) {
                        this.commandExecuting_ = false;
                        break;
                    }
                }
            }
        }

        private getActiveTopPageIndex(): number {
            var pageIndex = -1;
            var pages = this.eventData_.pages;
            var len = pages.length;
            for (var i = len - 1; i >= 0; i--) {
                var page = pages[i];
                if (core.GameState.checkConditions(this, page.conditions)) {
                    pageIndex = i;
                    break;
                }
            }

            return pageIndex;
        }

        private checkTrigger(): void {
            if (!this.currentPage) {
                return;
            }

            var triggers = this.currentPage.triggers;
            if (triggers.length > 0 && core.GameState.checkCondition(this, triggers)) {
                if (this.currentPage.commands.length > 0) {
                    this.commandExecuting_ = true;
                    this.commandIndex_ = 0;
                }
            } 
        }

        private setPageIndex(index: number): void {
            if (this.pageIndex_ != index) {
                this.pageIndex_ = index;
                this.mapCharacter_.chipsetId = this.eventData_.pages[index].status.chipsetId;
                this.mapCharacter_.ignoreTile = false;
                this.mapCharacter_.ignoreCharacter = false;
                this.mapCharacter_.ignoreTrigger = false;
            }
        }
    }
}
