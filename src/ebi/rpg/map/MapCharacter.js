var ebi;
(function (ebi) {
    (function (rpg) {
        (function (map) {
            var MapCharacter = (function () {
                function MapCharacter(id, map) {
                    this.switchFrameDir_ = 1;
                    this.frameNo_ = 1;
                    this.dir_ = 0;
                    this.timer_ = 0;
                    this.sprite_ = null;
                    this.x_ = 0;
                    this.y_ = 0;
                    this.vx_ = 0;
                    this.vy_ = 0;
                    this.charaChipset_ = rpg.core.DatabaseManager.getCharaChipsetData(id);
                    var image = ebi.game.ResourcePreloader.getImage(this.charaChipset_.src);
                    this.frameNo_ = this.charaChipset_.defaultFrameNo;
                    this.dir_ = 0;
                    this.map_ = map;
                    this.speed_ = 3;
                    this.sprite_ = new ebi.game.Sprite(image);
                    this.sprite_.srcX = 0;
                    this.sprite_.srcY = 0;
                    this.sprite_.srcWidth = this.charaChipset_.size[0];
                    this.sprite_.srcHeight = this.charaChipset_.size[1];
                    this.collisionObject_ = ebi.collision.CollisionSystem.createCollisionCircle(this.charaChipset_.hitRect[0], this.charaChipset_.hitRect[1], this.charaChipset_.hitRect[2]);
                    this.updateVisual();
                }
                MapCharacter.prototype.dispose = function () {
                    this.collisionObject_.dispose();
                };
                MapCharacter.prototype.setPosition = function (x, y) {
                    this.collisionObject_.setPos(x, y);
                };
                Object.defineProperty(MapCharacter.prototype, "width", {
                    get: function () {
                        return this.sprite_.srcWidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapCharacter.prototype, "height", {
                    get: function () {
                        return this.sprite_.srcHeight;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapCharacter.prototype, "screenX", {
                    get: function () {
                        return this.collisionObject_.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapCharacter.prototype, "screenY", {
                    get: function () {
                        return this.collisionObject_.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapCharacter.prototype, "controlable", {
                    get: function () {
                        return this.controlable_;
                    },
                    set: function (value) {
                        this.controlable_ = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                MapCharacter.prototype.update = function () {
                    var wasMoving = this.isMoving;
                    if(this.controlable) {
                        this.setVelocity(this.speed_ * rpg.ui.AnalogInputController.inputDx, this.speed_ * rpg.ui.AnalogInputController.inputDy);
                    } else {
                        this.setVelocity(0, 0);
                    }
                    this.updateDir();
                    if(!this.isMoving && wasMoving) {
                        this.onMoveStop();
                    }
                    this.updateFrame();
                    this.updateVisual();
                };
                MapCharacter.prototype.onMoveStop = function () {
                    this.frameNo_ = this.charaChipset_.defaultFrameNo;
                };
                Object.defineProperty(MapCharacter.prototype, "isMoving", {
                    get: function () {
                        return (this.vx_ !== 0 || this.vy_ !== 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                MapCharacter.prototype.setVelocity = function (vx, vy) {
                    this.vx_ = vx;
                    this.vy_ = vy;
                    this.collisionObject_.setVelocity(vx, vy);
                };
                MapCharacter.prototype.updateDir = function () {
                    if(!this.isMoving) {
                        return;
                    }
                    var t = Math.atan2(this.vy_, this.vx_) / Math.PI;
                    var angle = 1 - (0.5 * t + 0.75 - (1 / (2 * this.charaChipset_.dirCount))) % 1;
                    this.dir_ = Math.floor(angle * this.charaChipset_.dirCount) % this.charaChipset_.dirCount;
                };
                MapCharacter.prototype.updateFrame = function () {
                    if(!this.isMoving) {
                        return;
                    }
                    this.timer_++;
                    if(this.timer_ > 10) {
                        this.timer_ = 0;
                        this.frameNo_ += this.switchFrameDir_;
                        if(this.frameNo_ >= this.charaChipset_.frameCount - 1) {
                            this.frameNo_ = this.charaChipset_.frameCount - 1;
                            this.switchFrameDir_ = -1;
                        }
                        if(this.frameNo_ <= 0) {
                            this.frameNo_ = 0;
                            this.switchFrameDir_ = 1;
                        }
                    }
                };
                MapCharacter.prototype.updateVisual = function () {
                    this.sprite_.srcX = (this.charaChipset_.srcIndex[0] * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.size[0];
                    this.sprite_.srcY = (this.charaChipset_.srcIndex[1] * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.size[1];
                    this.sprite_.x = this.collisionObject_.x;
                    this.sprite_.y = this.collisionObject_.y;
                };
                return MapCharacter;
            })();
            map.MapCharacter = MapCharacter;            
        })(rpg.map || (rpg.map = {}));
        var map = rpg.map;

    })(ebi.rpg || (ebi.rpg = {}));
    var rpg = ebi.rpg;

})(ebi || (ebi = {}));

