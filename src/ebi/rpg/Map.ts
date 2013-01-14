/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='../game/TmxTiledMap.ts' />
module ebi.rpg {
    export class Map {
        private tmxTiledMap_: ebi.game.TmxTiledMap;
        constructor() {
            this.tmxTiledMap_ = new ebi.game.TmxTiledMap('sample');

            // TODO Confirm preloading is working properly
            this.tmxTiledMap_.setLayerZ('bottom', 0);
            this.tmxTiledMap_.setLayerZ('middle', 0);
            this.tmxTiledMap_.setLayerZ('top',    1);

            var mapWidth = this.tmxTiledMap_.mapWidth;
            var mapHeight = this.tmxTiledMap_.mapHeight;
            var data = new number[](mapWidth * mapHeight);
            var index = 0;

            
            var edges = [];
            var mark = -1;

            // Check horizontal edges
            for (var y = 0; y < mapHeight - 1; y++) {
                for (var x = 0; x < mapWidth; x++) {
                    var data1 = this.tmxTiledMap_.getTileId(x, y, "collision");
                    var data2 = this.tmxTiledMap_.getTileId(x, y + 1, "collision");
                    
                    var hasEdge = Map.hasDown(data1) || Map.hasUp(data2);
                   if (mark >= 0) {
                        if (!hasEdge) {
                            edges.push(this.createHorizontalEdge(mark, x, y + 1));
                            mark = -1;
                        }
                    } else {
                        if (hasEdge) {
                            mark = x;
                        }
                    }
                }
                if (mark >= 0) {
                    edges.push(this.createHorizontalEdge(mark, mapWidth, y + 1));
                    mark = -1;
                }
            }

            // Check vertical edges
            for (var x = 0; x < mapWidth - 1; x++) {
                for (var y = 0; y < mapHeight; y++) {
                    var data1 = this.tmxTiledMap_.getTileId(x, y, "collision");
                    var data2 = this.tmxTiledMap_.getTileId(x + 1, y, "collision");
                    
                    var hasEdge = Map.hasRight(data1) || Map.hasLeft(data2);
                   if (mark >= 0) {
                        if (!hasEdge) {
                            edges.push(this.createVerticalEdge(x + 1, mark, y));
                            mark = -1;
                        }
                    } else {
                        if (hasEdge) {
                            mark = y;
                        }
                    }
                }
                if (mark >= 0) {
                    edges.push(this.createVerticalEdge(x + 1, mark, mapHeight));
                    mark = -1;
                }
            }

            ebi.collision.CollisionSystem.createCollisionEdges(0, 0, edges);
        }

        private createHorizontalEdge(startX: number, endX: number, y: number): ebi.collision.Edge {
            var ty = y * this.gridSizeY;
            // Note: adding/subtracting 1 to avoid stacking characters crossing the edge
            var edge = new ebi.collision.Edge(
                new ebi.collision.Point(startX * this.gridSizeX + 1, ty), 
                new ebi.collision.Point(endX * this.gridSizeX - 1, ty)
            );    
            return edge;        
        }

        private createVerticalEdge(x :number, startY: number, endY: number): ebi.collision.Edge {
            var tx = x * this.gridSizeX;
            // Note: adding/subtracting 1 to avoid stacking characters crossing the edge
            var edge = new ebi.collision.Edge(
                new ebi.collision.Point(tx, startY * this.gridSizeY + 1), 
                new ebi.collision.Point(tx, endY * this.gridSizeY - 1)
            );    
            return edge;        
        }

        // Note: We'd like to precompute this data
        private static hasDown(tileId: number): bool {
            return tileId == 0 || tileId == 1 || tileId == 2 || tileId == 4 || tileId == 5 || tileId == 6 || tileId == 12 || tileId == 14;
        }

        // Note: We'd like to precompute this data
        private static hasUp(tileId: number): bool {
            return tileId == 0 || tileId == 1 || tileId == 2 || tileId == 8 || tileId == 9 || tileId == 10 || tileId == 13 || tileId == 14;
        }

        // Note: We'd like to precompute this data
        private static hasLeft(tileId: number): bool {
            return tileId == 0 || tileId == 1 || tileId == 3 || tileId == 4 || tileId == 5 || tileId == 8 || tileId == 9 || tileId == 11;
        }

        // Note: We'd like to precompute this data
        private static hasRight(tileId: number): bool {
            return tileId == 0 || tileId == 2 || tileId == 4 || tileId == 6 || tileId == 7 || tileId == 8 || tileId == 10 || tileId == 11;
        }

        public dispose(): void {
            this.tmxTiledMap_.dispose();
            delete this.tmxTiledMap_;
        }

        public get gridSizeX(): number {
            return 32;
        }

        public get gridSizeY(): number {
            return 32;
        }

        public get mapWidth(): number {
            return this.tmxTiledMap_.mapWidth;
        }

        public get mapHeight(): number {
            return this.tmxTiledMap_.mapHeight;
        }
    }
}
