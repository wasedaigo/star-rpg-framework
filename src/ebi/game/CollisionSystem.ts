/// <reference path='../../b2/Box2D.d.ts' />
/// <reference path='./ICollidable.ts' />

// We should not use Box2D(or chipmunk) directly outside of CollisionSystem!
module ebi.game {
    // Constant to convert between physics-world position and screen position
    var PTM_RATIO: number = 32;

    class CollisionObject implements ICollidable {
        public b2Body_: Box2D.Dynamics.b2Body;
        public b2Fixtures_: Box2D.Dynamics.b2Fixture[];
        private id_: number;
        private static currentId: number = 0;

        constructor(body: Box2D.Dynamics.b2Body, fixtures: Box2D.Dynamics.b2Fixture[]) {
            this.b2Body_ = body;
            this.b2Fixtures_ = fixtures;
            this.id_ = CollisionObject.currentId++;
        }

        public dispose(): void {
            this.b2Fixtures_.forEach((b2Fixture) => {
                this.b2Body_.DestroyFixture(b2Fixture);
            });
            CollisionSystem.world.DestroyBody(this.b2Body_);
            delete this.b2Fixtures_;
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

    class ContactListener extends Box2D.Dynamics.b2ContactListener {

        private static CalcCancelingVelocity(normalVec: Box2D.Common.Math.b2Vec2, projectingVec: Box2D.Common.Math.b2Vec2): Box2D.Common.Math.b2Vec2 {
            var projectingVec = projectingVec.Copy();
            var cancelingVector = normalVec.Copy();
            cancelingVector.Multiply(Box2D.Common.Math.b2Math.Dot(normalVec, projectingVec));
            
            return cancelingVector;
        }

        private static CalcCanceledVelocity(normalVec: Box2D.Common.Math.b2Vec2, velocity: Box2D.Common.Math.b2Vec2): Box2D.Common.Math.b2Vec2 {
            var vel = velocity.Copy();
            var cancelingVelocity = ContactListener.CalcCancelingVelocity(normalVec, vel);

            // Move away the vector so that the fixture won't overlap!
            vel.Subtract(cancelingVelocity);

            return vel;
        }

        private static GetContactNormal(contact: Box2D.Dynamics.Contacts.b2Contact): Box2D.Common.Math.b2Vec2 {
            var worldManifold = new Box2D.Collision.b2WorldManifold();
            contact.GetWorldManifold(worldManifold);
            return worldManifold.m_normal.Copy();  
        }

        // In order to have RPG-style character collision, I put some effort here...
        // Not perfect, but acceptable. Maybe gotta move to ebi.rpg?
        public PreSolve(contact: Box2D.Dynamics.Contacts.b2Contact, oldManifold: Box2D.Collision.b2Manifold): void {
            // Process only when two fixtures are overlapping
            if (contact.IsTouching()) {

                // Skip physics operation
                contact.SetEnabled(false);

                var contactNormal = ContactListener.GetContactNormal(contact);

                var descs = [
                    {body: contact.GetFixtureA().GetBody(), sign: 1},
                    {body: contact.GetFixtureB().GetBody(), sign: -1}
                ];
                descs.forEach((desc, index)=>{
                    // Skip if bodies are trying to go apart
                    if (Box2D.Common.Math.b2Math.Dot(desc.body.GetLinearVelocity(), contactNormal) * desc.sign >= 0) {
                        desc.body.SetLinearVelocity(
                            ContactListener.CalcCanceledVelocity(contactNormal, desc.body.GetLinearVelocity())
                        );
                    }
                })
            }
        }
    }

    export class CollisionSystem {
        private static collidables = {};

        // Note: Right now we are only support single physics-world
        private static world_: Box2D.Dynamics.b2World = null;
        private static get world(): Box2D.Dynamics.b2World {
            if (!world_) {
                world_ = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
                world_.SetContinuousPhysics(true);
                var contactListener = new ContactListener();
                world_.SetContactListener(contactListener);
            }    
            return world_;
        }

        private static createCollisionObject(x: number, y: number, shapes: Box2D.Collision.Shapes.b2Shape[]): ICollidable {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            var b2BodyDef = Box2D.Dynamics.b2BodyDef;
            var b2Body = Box2D.Dynamics.b2Body;
            var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

            // Body Definition
            var bodyDef = new Box2D.Dynamics.b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(x / PTM_RATIO, y / PTM_RATIO);

            // Body
            var body = world.CreateBody(bodyDef);
            body.SetFixedRotation(true);

            // Fixture Definition
            var fixDef = new b2FixtureDef();
            fixDef.density = 1;
            fixDef.friction = 0;
            fixDef.restitution = 0;

            var fixtures = shapes.map((shape) => {
                fixDef.shape = shape;
                return body.CreateFixture(fixDef);
            });
            
            var collidable = new CollisionObject(body, fixtures);
            body.SetUserData(collidable);

            return collidable;
        }

        public static createCollisionRect(x: number, y: number, width: number, height: number): ICollidable {
            var shape = new Box2D.Collision.Shapes.b2PolygonShape();
            shape.SetAsBox(width / PTM_RATIO, height / PTM_RATIO);

            return createCollisionObject(x, y, [shape]);
        }

        public static createCollisionCircle(x: number, y: number, radius: number): ICollidable {
            var shape = new Box2D.Collision.Shapes.b2CircleShape();
            shape.SetRadius((radius / PTM_RATIO));

            return createCollisionObject(x, y, [shape]);
        }

        public static update(): void {
            // timestep delta, velocity iteration, rotation iteration
            world.Step(0.033, 3, 1);
        }
    }
}
