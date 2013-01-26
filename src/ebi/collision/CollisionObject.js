var ebi;
(function (ebi) {
    (function (collision) {
        var PTM_RATIO = 32;
        var CollisionObject = (function () {
            function CollisionObject(body, fixtures) {
                this.touchingObjects_ = [];
                this.touchedObjects_ = [];
                this.b2Body_ = body;
                this.b2Fixtures_ = fixtures;
                this.id_ = CollisionObject.currentId++;
                CollisionObject.collisionObjects[this.id_] = this;
            }
            CollisionObject.currentId = 0;
            CollisionObject.collisionObjects = {
            };
            CollisionObject.prototype.dispose = function () {
                var _this = this;
                this.b2Fixtures_.forEach(function (b2Fixture) {
                    _this.b2Body_.DestroyFixture(b2Fixture);
                });
                collision.CollisionSystem.world.DestroyBody(this.b2Body_);
                delete CollisionObject.collisionObjects[this.id_];
                delete this.b2Fixtures_;
                delete this.b2Body_;
            };
            CollisionObject.prototype.setPos = function (x, y) {
                var b2Vec2 = Box2D.Common.Math.b2Vec2;
                this.b2Body_.SetPosition(new b2Vec2(x / PTM_RATIO, y / PTM_RATIO));
            };
            CollisionObject.prototype.setVelocity = function (vx, vy) {
                var b2Vec2 = Box2D.Common.Math.b2Vec2;
                this.b2Body_.SetLinearVelocity(new b2Vec2(0, 0));
                this.b2Body_.ApplyImpulse(new b2Vec2(vx, vy), new b2Vec2(0, 0));
            };
            Object.defineProperty(CollisionObject.prototype, "x", {
                get: function () {
                    return this.b2Body_.GetPosition().x * PTM_RATIO;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollisionObject.prototype, "y", {
                get: function () {
                    return this.b2Body_.GetPosition().y * PTM_RATIO;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollisionObject.prototype, "id", {
                get: function () {
                    return this.id_;
                },
                enumerable: true,
                configurable: true
            });
            CollisionObject.prototype.addTouchingObject = function (obj) {
                this.touchingObjects_.push(obj);
            };
            CollisionObject.prototype.addTouchedObject = function (obj) {
                this.touchedObjects_.push(obj);
            };
            CollisionObject.prototype.reset = function () {
                this.touchingObjects_ = [];
                this.touchedObjects_ = [];
            };
            CollisionObject.resetAll = function resetAll() {
                for(var id in CollisionObject.collisionObjects) {
                    CollisionObject.collisionObjects[id].reset();
                }
            }
            return CollisionObject;
        })();
        collision.CollisionObject = CollisionObject;        
    })(ebi.collision || (ebi.collision = {}));
    var collision = ebi.collision;

})(ebi || (ebi = {}));

