/// <reference path='../map/Map.ts' />
/// <reference path='./EventData.ts' />

module ebi.rpg.event {
    export class EventObject {
        private map_: ebi.rpg.map.Map;
        private mapCharacter_: ebi.rpg.map.MapCharacter;
        constructor(map: ebi.rpg.map.Map, eventData: EventData) {
            this.map_ = map;
            this.mapCharacter_ = new ebi.rpg.map.MapCharacter(1, this.map_);
            this.mapCharacter_.setPosition(eventData.x, eventData.y);
            this.mapCharacter_.controlable = true;
        }

        public get mapCharacter(): ebi.rpg.map.MapCharacter {
            return this.mapCharacter_;
        }

        public update(): void {
            this.mapCharacter_.update();
        }
    }
}
