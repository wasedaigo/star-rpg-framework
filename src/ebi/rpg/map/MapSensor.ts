/// <reference path='./collision/CollisionObject.ts' />
/// <reference path='./collision/CollisionSystem.ts' />
/// <reference path='../Event/EventObject.ts' />

module ebi.rpg.map {
    export class MapSensor {
        private collisionObject_: collision.CollisionObject;
        public check(eo: event.EventObject): void {
        	var chara = eo.mapCharacter;
            this.collisionObject_ = collision.CollisionSystem.createCollisionCircle(
                chara.senseX, chara.senseY, 1 + chara.width / 2, true, 1
            );
            this.collisionObject_.category = collision.Category.CharacterSensor;
            this.collisionObject_.data = eo.eventId; // 0 is an eventId
        }
    }
}
