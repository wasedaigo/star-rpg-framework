var ebi;
(function (ebi) {
    (function (game) {
        var Image = (function () {
            function Image(ccImage) {
                this.ccImage_ = ccImage;
            }
            Image.load = function load(path, callback) {
                var ccCache = cc.TextureCache.getInstance();
                ccCache.addImageAsync(path, true, function () {
                    var ccImage = ccCache.textureForKey(path);
                    callback(new Image(ccImage));
                });
            }
            Object.defineProperty(Image.prototype, "width", {
                get: function () {
                    return this.ccImage_.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "height", {
                get: function () {
                    return this.ccImage_.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "innerImage", {
                get: function () {
                    return this.ccImage_;
                },
                enumerable: true,
                configurable: true
            });
            return Image;
        })();
        game.Image = Image;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

