var Box2D;
(function (Box2D) {
    })(Box2D || (Box2D = {}));

var ebi;
(function (ebi) {
    (function (collision) {
        var PTM_RATIO = 32;
        var ContactListener = function () {
        };
        Box2D.inherit(ContactListener, Box2D.Dynamics.b2ContactListener);
        ContactListener.CalcCancelingVelocity = function (normalVec, projectingVec) {
            var projectingVec = projectingVec.Copy();
            var cancelingVector = normalVec.Copy();
            cancelingVector.Multiply(Box2D.Common.Math.b2Math.Dot(normalVec, projectingVec));
            return cancelingVector;
        };
        ContactListener.CalcCanceledVelocity = function (normalVec, velocity) {
            var vel = velocity.Copy();
            var cancelingVelocity = ContactListener.CalcCancelingVelocity(normalVec, vel);
            vel.Subtract(cancelingVelocity);
            return vel;
        };
        ContactListener.GetContactNormal = function (contact) {
            var worldManifold = new Box2D.Collision.b2WorldManifold();
            contact.GetWorldManifold(worldManifold);
            return worldManifold.m_normal.Copy();
        };
        ContactListener.prototype.PreSolve = function (contact, oldManifold) {
            var b2Body = Box2D.Dynamics.b2Body;
            if(contact.GetFixtureA().GetBody().GetType() == b2Body.b2_staticBody) {
                return;
            }
            if(contact.GetFixtureB().GetBody().GetType() == b2Body.b2_staticBody) {
                return;
            }
            if(contact.IsTouching()) {
                contact.SetEnabled(false);
                var contactNormal = ContactListener.GetContactNormal(contact);
                var bodyA = contact.GetFixtureA().GetBody();
                var bodyB = contact.GetFixtureB().GetBody();
                var objectA = bodyA.GetUserData();
                var objectB = bodyB.GetUserData();
                if(Box2D.Common.Math.b2Math.Dot(bodyA.GetLinearVelocity(), contactNormal) > 0) {
                    objectA.addTouchingObject(objectB);
                    objectB.addTouchedObject(objectA);
                    bodyA.SetLinearVelocity(ContactListener.CalcCanceledVelocity(contactNormal, bodyA.GetLinearVelocity()));
                }
                if(Box2D.Common.Math.b2Math.Dot(bodyB.GetLinearVelocity(), contactNormal) < 0) {
                    objectB.addTouchingObject(objectA);
                    objectA.addTouchedObject(objectB);
                    bodyB.SetLinearVelocity(ContactListener.CalcCanceledVelocity(contactNormal, bodyB.GetLinearVelocity()));
                }
            }
        };
        var CollisionSystem = (function () {
            function CollisionSystem() { }
            CollisionSystem.world_ = null;
            Object.defineProperty(CollisionSystem, "world", {
                get: function () {
                    if(!CollisionSystem.world_) {
                        CollisionSystem.world_ = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
                        CollisionSystem.world_.SetContinuousPhysics(true);
                        CollisionSystem.world_.SetContactListener(new ContactListener());
                    }
                    return CollisionSystem.world_;
                },
                enumerable: true,
                configurable: true
            });
            CollisionSystem.createCollisionObject = function createCollisionObject(x, y, shapes, isStatic) {
                var b2Vec2 = Box2D.Common.Math.b2Vec2;
                var b2BodyDef = Box2D.Dynamics.b2BodyDef;
                var b2Body = Box2D.Dynamics.b2Body;
                var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
                var bodyDef = new Box2D.Dynamics.b2BodyDef();
                if(isStatic) {
                    bodyDef.type = b2Body.b2_staticBody;
                } else {
                    bodyDef.type = b2Body.b2_dynamicBody;
                }
                bodyDef.position.Set(x / PTM_RATIO, y / PTM_RATIO);
                var body = CollisionSystem.world.CreateBody(bodyDef);
                body.SetFixedRotation(true);
                var fixDef = new b2FixtureDef();
                fixDef.density = 1;
                fixDef.friction = 0;
                fixDef.restitution = 0;
                var fixtures = shapes.map(function (shape) {
                    fixDef.shape = shape;
                    body.CreateFixture(fixDef);
                });
                var collisionObject = new collision.CollisionObject(body, fixtures);
                body.SetUserData(collisionObject);
                return collisionObject;
            }
            CollisionSystem.createCollisionEdges = function createCollisionEdges(x, y, edges) {
                var b2Vec2 = Box2D.Common.Math.b2Vec2;
                var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
                var shapes = [];
                edges.forEach(function (edge) {
                    var polyShape = new b2PolygonShape();
                    var startPoint = new b2Vec2(edge.start.x / PTM_RATIO, edge.start.y / PTM_RATIO);
                    var endPoint = new b2Vec2(edge.end.x / PTM_RATIO, edge.end.y / PTM_RATIO);
                    polyShape.SetAsArray([
                        startPoint, 
                        endPoint
                    ], 2);
                    shapes.push(polyShape);
                });
                return CollisionSystem.createCollisionObject(x, y, shapes, true);
            }
            CollisionSystem.createCollisionRect = function createCollisionRect(x, y, width, height) {
                var shape = new Box2D.Collision.Shapes.b2PolygonShape();
                shape.SetAsBox(width / PTM_RATIO, height / PTM_RATIO);
                return CollisionSystem.createCollisionObject(x, y, [
                    shape
                ], false);
            }
            CollisionSystem.createCollisionCircle = function createCollisionCircle(x, y, radius) {
                var shape = new Box2D.Collision.Shapes.b2CircleShape();
                shape.SetRadius((radius / PTM_RATIO));
                shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0.5, 0.5));
                return CollisionSystem.createCollisionObject(x, y, [
                    shape
                ], false);
            }
            CollisionSystem.update = function update() {
                collision.CollisionObject.resetAll();
                var ms = 1 / 60;
                CollisionSystem.world.Step(ms, 3, 1);
            }
            return CollisionSystem;
        })();
        collision.CollisionSystem = CollisionSystem;        
    })(ebi.collision || (ebi.collision = {}));
    var collision = ebi.collision;

})(ebi || (ebi = {}));

