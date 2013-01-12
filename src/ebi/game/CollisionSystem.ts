/// <reference path='../../b2/Box2D.d.ts' />
/// <reference path='./ICollidable.ts' />

module ebi.game {
    var PTM_RATIO: number = 32;
    class b2CollisionObject implements ICollidable {
        public b2Body_: Box2D.Dynamics.b2Body;
        public b2Fixture_: Box2D.Dynamics.b2Fixture;
        private id_: number;
        private static currentId: number = 0;

        constructor(body: Box2D.Dynamics.b2Body, fixture: Box2D.Dynamics.b2Fixture) {
            this.b2Body_ = body;
            this.b2Fixture_ = fixture;
            this.id_ = b2CollisionObject.currentId++;
        }

        public destroy(world: Box2D.Dynamics.b2World): void {
            this.b2Body_.DestroyFixture(this.b2Fixture_);
            world.DestroyBody(this.b2Body_);
            delete this.b2Fixture_;
            delete this.b2Body_;  
        }

        public setPos(x: number, y: number): void {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            this.b2Body_.SetPosition(new b2Vec2(x / PTM_RATIO, y / PTM_RATIO));
        }

        public setVelocity(vx: number, vy: number): void {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            this.b2Body_.SetLinearVelocity(new b2Vec2(0, 0));
            this.b2Body_.ApplyImpulse(new b2Vec2(vx / PTM_RATIO, vy / PTM_RATIO), new b2Vec2(0, 0));
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
    }
    /*
     * CollisionRect
     *
     * I'll make a layer which holds multiple sprites later.
     */
    export class CollisionSystem {
        private static World: Box2D.Dynamics.b2World = null;
        private static collidables = {};

        public static createCollisionRect(rect: number[]): ICollidable {
            if (!World) {
                World = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
                World.SetContinuousPhysics(true);
            }
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            var b2BodyDef = Box2D.Dynamics.b2BodyDef;
            var b2Body = Box2D.Dynamics.b2Body;
            var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
            var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

            var fixDef = new b2FixtureDef();
            fixDef.density = 0;
            fixDef.friction = 0;
            fixDef.restitution = 0;

            var shape = new b2PolygonShape();
            shape.SetAsBox(rect[2] / PTM_RATIO, rect[3] / PTM_RATIO);
            fixDef.shape = shape;

            var bodyDef = new Box2D.Dynamics.b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(rect[0] / PTM_RATIO, rect[1] / PTM_RATIO);
            bodyDef.userData = this;
            var body = World.CreateBody(bodyDef);
            body.SetSleepingAllowed(false);
            body.SetFixedRotation(true);
            var fixture = body.CreateFixture(fixDef);
            var collidable = new b2CollisionObject(body, fixture);

            collidables[collidable.id] = collidable;

            return collidable;
        }

        public static destroyCollisionObject(collidable: ICollidable): void {
            // TODO: add assertion
            delete collidables[collidable.id];
            collidable.destroy(World);
        }

        public static update(): void {
            if (World) {
                World.Step(0.033, 8, 1);  
            }
        }
    }
}
