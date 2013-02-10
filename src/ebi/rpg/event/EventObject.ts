/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCharacter.ts' />
/// <reference path='./EventData.ts' />
/// <reference path='./ConditionChecker.ts' />

module ebi.rpg.event {
    export class EventObject {
        private map_: map.Map;
        private mapCharacter_: map.MapCharacter;
        private pageIndex_: number = -1;
        private eventData_: EventData;
        constructor(map: map.Map, eventData: EventData) {
            this.eventData_ = eventData;
            this.map_ = map;
            // Setup Default MapCharacter (Invisible / Non-Interactive)
            this.mapCharacter_ = new rpg.map.MapCharacter(eventData.id, this.map_);
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

        public updatePage(): void {
            var index = this.getActiveTopPageIndex();
            this.setPageIndex(index);
        }

        public updateCommand(): void {

        }

        public updateMapCharacter(): void {
            this.mapCharacter_.update();
        }

        private getActiveTopPageIndex(): number {
            var pageIndex = -1;
            var pages = this.eventData_.pages;
            var len = pages.length;
            for (var i = len - 1; i >= 0; i--) {
                var page = pages[i];
                if (ConditionChecker.checkConditions(page.conditions)) {
                    pageIndex = i;
                    break;
                }
            }

            return pageIndex;
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
