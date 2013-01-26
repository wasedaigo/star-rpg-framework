var ebi;
(function (ebi) {
    (function (game) {
        var Sprite = (function () {
            function Sprite(image) {
                this.z_ = 0;
                var id = game.DisplayObjects.add(this);
                this.image_ = image;
                var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
                this.ccSprite_ = cc.Sprite.createWithTexture(image.innerImage, rect);
                this.ccSprite_.setAnchorPoint(new cc.Point(0, 0));
                this.ccSprite_.setTag(id);
                this.x = 0;
                this.y = 0;
                this.srcX = 0;
                this.srcY = 0;
                this.srcWidth = image.width;
                this.srcHeight = image.height;
            }
            Object.defineProperty(Sprite.prototype, "image", {
                get: function () {
                    return this.image_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "x", {
                get: function () {
                    return this.ccSprite_.getPositionX();
                },
                set: function (x) {
                    this.ccSprite_.setPositionX(x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "y", {
                get: function () {
                    return this.ccSprite_.getPositionY();
                    ; ;
                },
                set: function (y) {
                    this.ccSprite_.setPositionY(y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "z", {
                get: function () {
                    return this.z_;
                },
                set: function (z) {
                    if(this.z_ !== z) {
                        this.z_ = z;
                        game.DisplayObjects.addDrawableToReorder(this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "srcX", {
                get: function () {
                    return this.srcX_;
                },
                set: function (value) {
                    this.srcX_ = value;
                    this.updateSrcRect();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "srcY", {
                get: function () {
                    return this.srcY_;
                },
                set: function (value) {
                    this.srcY_ = value;
                    this.updateSrcRect();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "srcWidth", {
                get: function () {
                    return this.srcWidth_;
                },
                set: function (value) {
                    this.srcWidth_ = value;
                    this.updateSrcRect();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "srcHeight", {
                get: function () {
                    return this.srcHeight_;
                },
                set: function (value) {
                    this.srcHeight_ = value;
                    this.updateSrcRect();
                },
                enumerable: true,
                configurable: true
            });
            Sprite.prototype.setVisible = function (isVisible) {
                this.ccSprite_.setVisible(isVisible);
            };
            Sprite.prototype.dispose = function () {
                game.DisplayObjects.remove(this);
            };
            Object.defineProperty(Sprite.prototype, "innerObject", {
                get: function () {
                    return this.ccSprite_;
                },
                enumerable: true,
                configurable: true
            });
            Sprite.prototype.updateSrcRect = function () {
                var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
                this.ccSprite_.setTextureRect(rect);
            };
            return Sprite;
        })();
        game.Sprite = Sprite;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

