var ebi;
(function (ebi) {
    (function (rpg) {
        (function (map) {
            var Map = (function () {
                function Map() {
                    this.tmxTiledMap_ = new ebi.game.TmxTiledMap('sample');
                    this.tmxTiledMap_.setLayerZ('bottom', 0);
                    this.tmxTiledMap_.setLayerZ('middle', 0);
                    this.tmxTiledMap_.setLayerZ('top', 1);
                    this.tmxTiledMap_.setLayerZ('collision', 1);
                    var edges = this.extractEdges();
                    this.collision_ = ebi.collision.CollisionSystem.createCollisionEdges(0, 0, edges);
                }
                Map.prototype.dispose = function () {
                    this.tmxTiledMap_.dispose();
                    delete this.tmxTiledMap_;
                    this.collision_.dispose();
                    delete this.collision_;
                };
                Map.prototype.extractEdges = function () {
                    var edges = [];
                    edges = edges.concat(this.extractHorizontalEdges());
                    edges = edges.concat(this.extractVerticalEdges());
                    edges = edges.concat(this.extractBorderEdges());
                    return edges;
                };
                Map.prototype.extractBorderEdges = function () {
                    var edges = [];
                    edges.push(this.createHorizontalEdge(0, this.xCount, this.yCount));
                    edges.push(this.createHorizontalEdge(0, this.xCount, 0));
                    edges.push(this.createVerticalEdge(0, 0, this.yCount));
                    edges.push(this.createVerticalEdge(this.xCount, 0, this.yCount));
                    return edges;
                };
                Map.prototype.extractHorizontalEdges = function () {
                    var xCount = this.tmxTiledMap_.xCount;
                    var yCount = this.tmxTiledMap_.yCount;
                    var edges = [];
                    var edgeStartPos = -1;
                    for(var y = 0; y < yCount - 1; y++) {
                        for(var x = 0; x < xCount; x++) {
                            var data1 = this.tmxTiledMap_.getTileId(x, y, 'collision');
                            var data2 = this.tmxTiledMap_.getTileId(x, y + 1, 'collision');
                            var hasEdge = Map.hasDown(data1) || Map.hasUp(data2);
                            if(edgeStartPos >= 0) {
                                if(!hasEdge) {
                                    edges.push(this.createHorizontalEdge(edgeStartPos, x, y + 1));
                                    edgeStartPos = -1;
                                }
                            } else {
                                if(hasEdge) {
                                    edgeStartPos = x;
                                }
                            }
                        }
                        if(edgeStartPos >= 0) {
                            edges.push(this.createHorizontalEdge(edgeStartPos, xCount, y + 1));
                            edgeStartPos = -1;
                        }
                    }
                    return edges;
                };
                Map.prototype.extractVerticalEdges = function () {
                    var xCount = this.tmxTiledMap_.xCount;
                    var yCount = this.tmxTiledMap_.yCount;
                    var edges = [];
                    var edgeStartPos = -1;
                    for(var x = 0; x < xCount - 1; x++) {
                        for(var y = 0; y < yCount; y++) {
                            var data1 = this.tmxTiledMap_.getTileId(x, y, 'collision');
                            var data2 = this.tmxTiledMap_.getTileId(x + 1, y, 'collision');
                            var hasEdge = Map.hasRight(data1) || Map.hasLeft(data2);
                            if(edgeStartPos >= 0) {
                                if(!hasEdge) {
                                    edges.push(this.createVerticalEdge(x + 1, edgeStartPos, y));
                                    edgeStartPos = -1;
                                }
                            } else {
                                if(hasEdge) {
                                    edgeStartPos = y;
                                }
                            }
                        }
                        if(edgeStartPos >= 0) {
                            edges.push(this.createVerticalEdge(x + 1, edgeStartPos, yCount));
                            edgeStartPos = -1;
                        }
                    }
                    return edges;
                };
                Map.prototype.createHorizontalEdge = function (startX, endX, y) {
                    var ty = y * this.gridSizeY;
                    var edge = new ebi.collision.Edge(new ebi.collision.Point(startX * this.gridSizeX + 1, ty), new ebi.collision.Point(endX * this.gridSizeX - 1, ty));
                    return edge;
                };
                Map.prototype.createVerticalEdge = function (x, startY, endY) {
                    var tx = x * this.gridSizeX;
                    var edge = new ebi.collision.Edge(new ebi.collision.Point(tx, startY * this.gridSizeY + 1), new ebi.collision.Point(tx, endY * this.gridSizeY - 1));
                    return edge;
                };
                Map.hasDown = function hasDown(tileId) {
                    return [
                        0, 
                        1, 
                        2, 
                        4, 
                        5, 
                        6, 
                        12, 
                        14
                    ].some(function (id) {
                        return tileId == id;
                    });
                }
                Map.hasUp = function hasUp(tileId) {
                    return [
                        0, 
                        1, 
                        2, 
                        8, 
                        9, 
                        10, 
                        13, 
                        14
                    ].some(function (id) {
                        return tileId == id;
                    });
                }
                Map.hasLeft = function hasLeft(tileId) {
                    return [
                        0, 
                        1, 
                        3, 
                        4, 
                        5, 
                        8, 
                        9, 
                        11
                    ].some(function (id) {
                        return tileId == id;
                    });
                }
                Map.hasRight = function hasRight(tileId) {
                    return [
                        0, 
                        2, 
                        4, 
                        6, 
                        7, 
                        8, 
                        10, 
                        11
                    ].some(function (id) {
                        return tileId == id;
                    });
                }
                Object.defineProperty(Map.prototype, "gridSizeX", {
                    get: function () {
                        return 32;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Map.prototype, "gridSizeY", {
                    get: function () {
                        return 32;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Map.prototype, "xCount", {
                    get: function () {
                        return this.tmxTiledMap_.xCount;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Map.prototype, "yCount", {
                    get: function () {
                        return this.tmxTiledMap_.yCount;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Map.prototype, "width", {
                    get: function () {
                        return this.xCount * this.gridSizeX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Map.prototype, "height", {
                    get: function () {
                        return this.yCount * this.gridSizeY;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Map;
            })();
            map.Map = Map;            
        })(rpg.map || (rpg.map = {}));
        var map = rpg.map;

    })(ebi.rpg || (ebi.rpg = {}));
    var rpg = ebi.rpg;

})(ebi || (ebi = {}));

