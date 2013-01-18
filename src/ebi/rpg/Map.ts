/// <reference path='../collision/CollisionSystem.ts' />
/// <reference path='../collision/ICollidable.ts' />
/// <reference path='../game/TmxTiledMap.ts' />

module ebi.rpg {

    export class Map {

        private tmxTiledMap_: ebi.game.TmxTiledMap;
        private collision_: ebi.collision.ICollidable;
        constructor() {
            this.tmxTiledMap_ = new ebi.game.TmxTiledMap('sample');

            // TODO Confirm preloading is working properly
            this.tmxTiledMap_.setLayerZ('bottom', 0);
            this.tmxTiledMap_.setLayerZ('middle', 0);
            this.tmxTiledMap_.setLayerZ('top',    1);
            this.tmxTiledMap_.setLayerZ('collision',    1);

            var edges = this.extractEdges();
            this.collision_ = ebi.collision.CollisionSystem.createCollisionEdges(0, 0, edges);
        }

        public dispose(): void {
            this.tmxTiledMap_.dispose();
            delete this.tmxTiledMap_;
            this.collision_.dispose();
            delete this.collision_;
        }

        private extractEdges(): ebi.collision.Edge[] {
            var edges: ebi.collision.Edge[] = [];
            edges = edges.concat(this.extractHorizontalEdges());
            edges = edges.concat(this.extractVerticalEdges());
            edges = edges.concat(this.extractBorderEdges());
            return edges;
        }

        private extractBorderEdges(): ebi.collision.Edge[] {
            var edges: ebi.collision.Edge[] = [];

            // Down
            edges.push(this.createHorizontalEdge(0, this.xCount, this.yCount));
            // Up
            edges.push(this.createHorizontalEdge(0, this.xCount, 0));
            // Left
            edges.push(this.createVerticalEdge(0, 0, this.yCount));
            // Right
            edges.push(this.createVerticalEdge(this.xCount, 0, this.yCount));

            return edges;
        }

        private extractHorizontalEdges(): ebi.collision.Edge[] {
            var xCount = this.tmxTiledMap_.xCount;
            var yCount = this.tmxTiledMap_.yCount;
            var edges: ebi.collision.Edge[] = [];

            var edgeStartPos = -1; // A variable to keep track of edge continuity

            // Check horizontal edges
            for (var y = 0; y < yCount - 1; y++) {
                for (var x = 0; x < xCount; x++) {
                    var data1 = this.tmxTiledMap_.getTileId(x, y, 'collision');
                    var data2 = this.tmxTiledMap_.getTileId(x, y + 1, 'collision');
                    
                    var hasEdge = Map.hasDown(data1) || Map.hasUp(data2);
                    if (edgeStartPos >= 0) {
                        if (!hasEdge) {
                            edges.push(this.createHorizontalEdge(edgeStartPos, x, y + 1));
                            edgeStartPos = -1;
                        }
                    } else {
                        if (hasEdge) {
                            edgeStartPos = x;
                        }
                    }
                }
                if (edgeStartPos >= 0) {
                    edges.push(this.createHorizontalEdge(edgeStartPos, xCount, y + 1));
                    edgeStartPos = -1;
                }
            }

            return edges;
        }

        private extractVerticalEdges(): ebi.collision.Edge[] {
            var xCount = this.tmxTiledMap_.xCount;
            var yCount = this.tmxTiledMap_.yCount;
            var edges: ebi.collision.Edge[] = [];

            var edgeStartPos = -1; // A variable to keep track of edge continuity

            // Check vertical edges
            for (var x = 0; x < xCount - 1; x++) {
                for (var y = 0; y < yCount; y++) {
                    var data1 = this.tmxTiledMap_.getTileId(x, y, 'collision');
                    var data2 = this.tmxTiledMap_.getTileId(x + 1, y, 'collision');
                    
                    var hasEdge = Map.hasRight(data1) || Map.hasLeft(data2);
                    if (edgeStartPos >= 0) {
                        if (!hasEdge) {
                            edges.push(this.createVerticalEdge(x + 1, edgeStartPos, y));
                            edgeStartPos = -1;
                        }
                    } else {
                        if (hasEdge) {
                            edgeStartPos = y;
                        }
                    }
                }
                if (edgeStartPos >= 0) {
                    edges.push(this.createVerticalEdge(x + 1, edgeStartPos, yCount));
                    edgeStartPos = -1;
                }
            }

            return edges;
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
            return [0, 1, 2, 4, 5, 6, 12, 14].some((id) => tileId == id);
        }

        // Note: We'd like to precompute this data
        private static hasUp(tileId: number): bool {
            return [0, 1, 2, 8, 9, 10, 13, 14].some((id) => tileId == id);
        }

        // Note: We'd like to precompute this data
        private static hasLeft(tileId: number): bool {
            return [0, 1, 3, 4, 5, 8, 9, 11].some((id) => tileId == id);
        }

        // Note: We'd like to precompute this data
        private static hasRight(tileId: number): bool {
            return [0, 2, 4, 6, 7, 8, 10, 11].some((id) => tileId == id);
        }

        public get gridSizeX(): number {
            return 32;
        }

        public get gridSizeY(): number {
            return 32;
        }

        public get xCount(): number {
            return this.tmxTiledMap_.xCount;
        }

        public get yCount(): number {
            return this.tmxTiledMap_.yCount;
        }

        public get width(): number {
            return this.xCount * this.gridSizeX;
        }

        public get height(): number {
            return this.yCount * this.gridSizeY;
        }
    }
}
