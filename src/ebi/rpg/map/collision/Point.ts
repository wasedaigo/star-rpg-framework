module ebi.rpg.map.collision {

    export class Point {

        private x_: number = 0;
        private y_: number = 0;

        constructor(x: number, y: number) {
            this.x_ = x;
            this.y_ = y;
        }

        public get x(): number {
            return this.x_;
        }
        public get y(): number {
            return this.y_;
        }
    }

}
