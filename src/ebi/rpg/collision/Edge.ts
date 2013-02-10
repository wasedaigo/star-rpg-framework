module ebi.rpg.collision {

    export class Edge {

        private start_: Point;
        private end_: Point;

        constructor(start: Point, end: Point) {
            this.start_ = start;
            this.end_   = end;
        }

        public get start(): Point {
            return this.start_;
        }
        public get end(): Point {
            return this.end_;
        }

    }

}