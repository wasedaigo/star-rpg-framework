/// <reference path='../../../../b2/Box2D.d.ts' />
/// <reference path='./CollisionObject.ts' />
/// <reference path='./Edge.ts' />
/// <reference path='./Point.ts' />

module Box2D {
    declare function inherit(cls: any, base: any);
}

// We should not use Box2D(or chipmunk) directly outside of CollisionSystem!
module ebi.rpg.map.collision {

    // Constant to convert between physics-world position and screen position
    var PTM_RATIO: number = 32;

    var ContactListener: any = function () {};
    Box2D.inherit(ContactListener, Box2D.Dynamics.b2ContactListener);

    ContactListener.CalcCancelingVelocity = function (normalVec: Box2D.Common.Math.b2Vec2, projectingVec: Box2D.Common.Math.b2Vec2): Box2D.Common.Math.b2Vec2 {
        var projectingVec = projectingVec.Copy();
        var cancelingVector = normalVec.Copy();
        cancelingVector.Multiply(Box2D.Common.Math.b2Math.Dot(normalVec, projectingVec));
        return cancelingVector;
    }

    ContactListener.CalcCanceledVelocity = function (normalVec: Box2D.Common.Math.b2Vec2, velocity: Box2D.Common.Math.b2Vec2): Box2D.Common.Math.b2Vec2 {
        var vel = velocity.Copy();
        var cancelingVelocity = ContactListener.CalcCancelingVelocity(normalVec, vel);

        // Move away the vector so that the fixture won't overlap!
        vel.Subtract(cancelingVelocity);

        return vel;
    }

    ContactListener.GetContactNormal = function (contact: Box2D.Dynamics.Contacts.b2Contact): Box2D.Common.Math.b2Vec2 {
        var worldManifold = new Box2D.Collision.b2WorldManifold();
        contact.GetWorldManifold(worldManifold);
        return worldManifold.m_normal.Copy();  
    }

    // In order to have RPG-style character collision, I put some effort here...
    // Not perfect, but acceptable. Maybe gotta move to ebi.rpg?
    ContactListener.prototype.PreSolve = function (contact: Box2D.Dynamics.Contacts.b2Contact,
                                                   oldManifold: Box2D.Collision.b2Manifold): void {  
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();
        var objectA = bodyA.GetUserData();
        var objectB = bodyB.GetUserData();

        var ignoreTrigger = objectA.ignoreTrigger | objectB.ignoreTrigger;
        var ignoreCollision = ((objectA.categoryBits & objectB.ignoreBits) === objectA.categoryBits ||
            (objectB.categoryBits & objectA.ignoreBits) === objectB.categoryBits);

        var b2Body = Box2D.Dynamics.b2Body;
        if (bodyA.GetType() == b2Body.b2_staticBody) {
            contact.SetSensor(ignoreCollision);
            return;
        }
        if (bodyB.GetType() == b2Body.b2_staticBody) {
            contact.SetSensor(ignoreCollision);
            return;
        }

        // Process only when two fixtures are overlapping
        if (contact.IsTouching()) {
            // Skip physics operation
            contact.SetEnabled(false);
            // Do not do anything if either of bodies is a static body (such as wall)
            var contactNormal = ContactListener.GetContactNormal(contact);

            // Process Object A
            if (Box2D.Common.Math.b2Math.Dot(bodyA.GetLinearVelocity(), contactNormal) > 0) {
                if (ignoreTrigger) {
                    objectA.addTouchingObject(objectB);
                    objectB.addTouchedObject(objectA);
                }
                if (ignoreCollision) {
                    contact.SetSensor(true);
                    return;
                }
                
                bodyA.SetLinearVelocity(
                    ContactListener.CalcCanceledVelocity(contactNormal, bodyA.GetLinearVelocity())
                );
            }

            // Process Object B
            if (Box2D.Common.Math.b2Math.Dot(bodyB.GetLinearVelocity(), contactNormal) < 0) {
                if (ignoreTrigger) {
                    objectB.addTouchingObject(objectA);
                    objectA.addTouchedObject(objectB);
                }
                if (ignoreCollision) {
                    contact.SetSensor(true);
                    return;
                }

                bodyB.SetLinearVelocity(
                    ContactListener.CalcCanceledVelocity(contactNormal, bodyB.GetLinearVelocity())
                );
            }
        }
    }

    export class CollisionSystem {
        //private static collidables = {};

        // Note: Right now we are only support single physics-world
        private static world_: Box2D.Dynamics.b2World = null;

        private static get world(): Box2D.Dynamics.b2World {
            if (!world_) {
                world_ = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
                world_.SetContinuousPhysics(true);
                world_.SetContactListener(new ContactListener());
            }    
            return world_;
        }

        private static createCollisionObject(x: number, y: number, shapes: Box2D.Collision.Shapes.b2Shape[], isStatic?: bool = false, isSensor?: bool = false, life?: number = 0): CollisionObject {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            var b2BodyDef = Box2D.Dynamics.b2BodyDef;
            var b2Body = Box2D.Dynamics.b2Body;
            var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

            // Body Definition
            var bodyDef = new Box2D.Dynamics.b2BodyDef();
            if (isStatic) {
                bodyDef.type = b2Body.b2_staticBody;
            } else {
                bodyDef.type = b2Body.b2_dynamicBody;
            }
            bodyDef.position.Set(x / PTM_RATIO, y / PTM_RATIO);

            // Body
            var body = world.CreateBody(bodyDef);
            body.SetFixedRotation(true);

            // Fixture Definition
            var fixDef = new b2FixtureDef();
            fixDef.density = 1;
            fixDef.friction = 0;
            fixDef.restitution = 0;
            fixDef.isSensor = isSensor;
            var fixtures = shapes.map((shape) => {
                fixDef.shape = shape;
                body.CreateFixture(fixDef);
            });

            var collisionObject = new CollisionObject(body, fixtures, life);
            body.SetUserData(collisionObject);

            return collisionObject;
        }

        // Box2D.Collision.Shapes.b2EdgeShape is not working in box2d.js
        public static createCollisionEdges(x: number, y: number, edges: Edge[], isSensor?: bool = false, life?: number = 0): CollisionObject {
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
            var shapes: Box2D.Collision.Shapes.b2Shape[] = [];
            edges.forEach((edge) => {
                //Simple way with no fixture.         
                var polyShape  = new b2PolygonShape();
                var startPoint = new b2Vec2(edge.start.x / PTM_RATIO, edge.start.y / PTM_RATIO);
                var endPoint   = new b2Vec2(edge.end.x   / PTM_RATIO, edge.end.y   / PTM_RATIO);
                polyShape.SetAsArray([startPoint, endPoint], 2);
                shapes.push(polyShape);
            })
            return createCollisionObject(x, y, shapes, true);
        }

        public static createCollisionRect(x: number, y: number, width: number, height: number, isSensor?: bool = false, life?: number = 0): CollisionObject {
            var shape = new Box2D.Collision.Shapes.b2PolygonShape();
            shape.SetAsOrientedBox(width / PTM_RATIO, height / PTM_RATIO, new Box2D.Common.Math.b2Vec2(0.5 ,0.45));
            return createCollisionObject(x, y, [shape], false, isSensor, life);
        }

        public static createCollisionCircle(x: number, y: number, radius: number, isSensor?: bool = false, life?: number = 0): CollisionObject {
            var shape = new Box2D.Collision.Shapes.b2CircleShape();
            shape.SetRadius((radius / PTM_RATIO));
            shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0.5 ,0.5));
            return createCollisionObject(x, y, [shape], false, isSensor, life);
        }

        public static update(): void {
            // Reset some data such as touching info before simulation
            CollisionObject.update();

            var ms = 1 / 60; // aim for 60 FPS
            // timestep delta, velocity iteration, rotation iteration
            world.Step(ms, 3, 1);
        }
    }
}
