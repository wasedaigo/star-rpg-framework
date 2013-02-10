
// We should not use Box2D(or chipmunk) directly outside of CollisionSystem!
module ebi.rpg.collision {

    // Constant to convert between physics-world position and screen position
    var PTM_RATIO: number = 32;

    export enum Category {
        Tile = 0,
        Character,
    }

    export class CollisionObject {

        private b2Body_: Box2D.Dynamics.b2Body;
        private b2Fixtures_: Box2D.Dynamics.b2Fixture[];
        private id_: number;
        private ignoreTrigger_: bool = false;
        private ignoreBits_: number = 0;
        private life_: number = 0;
        private categoryBits_: number = 0;
        private touchingObjects_: Object[] = [];
        private touchedObjects_: Object[] = [];
        private static currentId: number = 0;
        private static collisionObjects = {};

        constructor(body: Box2D.Dynamics.b2Body, fixtures: Box2D.Dynamics.b2Fixture[], life?: number = 0) {
            this.b2Body_ = body;
            this.b2Fixtures_ = fixtures;
            this.id_ = CollisionObject.currentId++;
            this.life_ = life;
            CollisionObject.collisionObjects[this.id_] = this;
        }

        public dispose(): void {
            this.b2Fixtures_.forEach((b2Fixture) => {
                this.b2Body_.DestroyFixture(b2Fixture);
            });
            CollisionSystem.world.DestroyBody(this.b2Body_);
            delete CollisionObject.collisionObjects[this.id_];
            delete this.b2Fixtures_;
            delete this.b2Body_;  
            delete this.id_;
        }

        public setPos(x: number, y: number): void {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            this.b2Body_.SetPosition(new b2Vec2(x / PTM_RATIO, y / PTM_RATIO));
        }

        public setVelocity(vx: number, vy: number): void {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            this.b2Body_.SetLinearVelocity(new b2Vec2(0, 0));
            this.b2Body_.ApplyImpulse(new b2Vec2(vx, vy), new b2Vec2(0, 0));
        }

        public get x(): number {
            return this.b2Body_.GetPosition().x * PTM_RATIO;
        }

        public get y(): number {
            return this.b2Body_.GetPosition().y * PTM_RATIO;
        }

        public get id(): number {
            return this.id_;
        }

        public addTouchingObject(obj: Object): void {
            this.touchingObjects_.push(obj);
        }

        public addTouchedObject(obj: Object): void {
            this.touchedObjects_.push(obj);
        }

        public get ignoreTrigger(): bool {
            return this.ignoreTrigger_;
        }

        public set ignoreTrigger(value: bool) {
            this.ignoreTrigger_ = value;
        }

        public get ignoreBits(): number {
            return this.ignoreBits_;
        }

        public get categoryBits(): number {
            return this.categoryBits_;
        }

        public setCategory(index: number): void {
            this.categoryBits_ = (1 << index);
        }

        public setIgnoreCategory(index: number, value: bool): void {
            var mask = (1 << index);
            if (value) {
                this.ignoreBits_ = this.ignoreBits_ | mask;
            } else {
                this.ignoreBits_ = (this.ignoreBits_ & (~mask));
            }
            
        }

        public reset(): void {
            this.touchingObjects_ = [];
            this.touchedObjects_ = [];
        }

        public tickLife(): void {
            // if life is set as 0 in the beginning, we do not dispose it automatically
            if (this.life_ > 0) {
                this.life_--;
                if (this.life_ == 0) {
                    this.dispose();
                }
            }
        }

        public static update(): void {
            for (var id in CollisionObject.collisionObjects) {
                var co = CollisionObject.collisionObjects[id];
                co.reset();
                co.tickLife();
            }
        }
    }
}
