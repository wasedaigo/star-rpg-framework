/// <reference path='../map/Map.ts' />
/// <reference path='./EventData.ts' />

module ebi.rpg.event {
    export class EventObject {
        private map_: ebi.rpg.map.Map;
        private mapCharacter_: ebi.rpg.map.MapCharacter;
        private pageIndex_: number = -1;
        private eventData_: EventData;
        constructor(map: ebi.rpg.map.Map, eventData: EventData) {
            this.eventData_ = eventData;
            this.map_ = map;
            // Setup Default MapCharacter (Invisible / Non-Interactive)
            this.mapCharacter_ = new ebi.rpg.map.MapCharacter(0, this.map_);
            this.mapCharacter_.setPosition(this.eventData_.x, this.eventData_.y);
            this.mapCharacter_.ignoreTile = true;
            this.mapCharacter_.ignoreCharacter = true;
            this.mapCharacter_.ignoreTrigger = true;
            this.mapCharacter_.controlable = true;
        }

        public get mapCharacter(): ebi.rpg.map.MapCharacter {
            return this.mapCharacter_;
        }

        public update(): void {
            this.mapCharacter_.update();
        }

        private setPageIndex(index: number): void {
            if (this.pageIndex_ != index) {
                this.pageIndex_ = index;
                this.mapCharacter_ = new ebi.rpg.map.MapCharacter(this.eventData_.pages[0].status.chipsetId, this.map_);
                this.mapCharacter_.setPosition(this.eventData_.x, this.eventData_.y);
                this.mapCharacter_.controlable = true;
            }
        }

        private setPage(pageNo: number): void {

        }
    }
}
