var ebi;
(function (ebi) {
    (function (game) {
        var TmxLayer = (function () {
            function TmxLayer(ccTMXLayer) {
                this.z_ = 0;
                this.firstGid_ = 0;
                var id = game.DisplayObjects.add(this);
                this.ccTMXLayer_ = ccTMXLayer;
                this.ccTMXLayer_.setTag(id);
                this.firstGid_ = this.ccTMXLayer_.getTileSet().firstGid;
                this.z = 0;
            }
            Object.defineProperty(TmxLayer.prototype, "z", {
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
            Object.defineProperty(TmxLayer.prototype, "innerObject", {
                get: function () {
                    return this.ccTMXLayer_;
                },
                enumerable: true,
                configurable: true
            });
            TmxLayer.prototype.getTileIdAt = function (x, y) {
                var gid = this.ccTMXLayer_.getTileGIDAt(new cc.Point(x, y));
                var id = gid - this.firstGid_;
                if(id < 0) {
                    id = -1;
                }
                return id;
            };
            TmxLayer.prototype.dispose = function () {
                game.DisplayObjects.remove(this);
            };
            return TmxLayer;
        })();        
        var TmxTiledMap = (function () {
            function TmxTiledMap(id) {
                var _this = this;
                this.ccTMXTiledMap_ = null;
                this.layers_ = {
                };
                this.ccTMXTiledMap_ = cc.TMXTiledMap.create(TmxTiledMap.prefix_ + id + '.tmx');
                var layerNames = this.ccTMXTiledMap_.getChildren().filter(function (node) {
                    return node instanceof cc.TMXLayer;
                }).map(function (node) {
                    var layer = node;
                    return layer.getLayerName();
                });
                layerNames.forEach(function (layerName) {
                    var layer = _this.ccTMXTiledMap_.getLayer(layerName);
                    _this.ccTMXTiledMap_.removeChild(layer, false);
                    _this.layers_[layerName] = new TmxLayer(layer);
                });
                this.mapSize_ = this.ccTMXTiledMap_.getMapSize();
            }
            TmxTiledMap.prefix_ = 'res/tmx/';
            TmxTiledMap.prototype.setLayerZ = function (layerName, z) {
                this.layers_[layerName].z = z;
            };
            Object.defineProperty(TmxTiledMap.prototype, "isMapLoaded", {
                get: function () {
                    return !!this.ccTMXTiledMap_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TmxTiledMap.prototype, "innerObject", {
                get: function () {
                    return this.ccTMXTiledMap_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TmxTiledMap.prototype, "xCount", {
                get: function () {
                    return this.mapSize_.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TmxTiledMap.prototype, "yCount", {
                get: function () {
                    return this.mapSize_.height;
                },
                enumerable: true,
                configurable: true
            });
            TmxTiledMap.prototype.getTileId = function (x, y, layerName) {
                if(x < 0 || x >= this.xCount || y < 0 || y >= this.yCount) {
                    return -1;
                }
                var layer = this.layers_[layerName];
                var id = layer.getTileIdAt(x, this.yCount - y - 1);
                return id;
            };
            TmxTiledMap.prototype.dispose = function () {
                var _this = this;
                var keys = Object.keys(this.layers_);
                keys.forEach(function (layerName) {
                    var layer = _this.layers_[layerName];
                    layer.dispose();
                    delete _this.layers_[layerName];
                });
            };
            return TmxTiledMap;
        })();
        game.TmxTiledMap = TmxTiledMap;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

