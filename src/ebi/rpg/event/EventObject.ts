/// <reference path='../core/GameState.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCharacter.ts' />
/// <reference path='./EventData.ts' />

module ebi.rpg.event {
    export class EventObject {
        private mapCharacter_: map.MapCharacter;
        private pageIndex_: number = -1;
        private eventData_: EventData;
        private checkedEventId_: number = -1;
        private touchedEventId_: number = -1;

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

        public update(): void {
            var index = this.getActiveTopPageIndex();
            this.setPageIndex(index);
            this.checkTrigger();
            this.mapCharacter_.update();
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
            if (this.pageIndex_ < 0) {
                return;
            }
            var page = this.eventData_.pages[this.pageIndex_];
            if (page.triggers.length > 0 && core.GameState.checkCondition(this, page.triggers)) {
                console.log("Triggered!");
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
