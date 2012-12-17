module clock.util {
    export class Table {

        //
        // private members
        //
        private width_: number;
        private data_: any[];
        private height_: number;

        //
        // public members
        //

        //
        // accessors
        //
        public get width(): number {return this.width_;}
        public get data(): any[] {return this.data_;}

        constructor(width, data) {
            this.width_ = width;
            this.data_ = data;
        }

        public get height(): number {
            if (!this.height_) {
                this.height_ = Math.floor(this.data_.length / this.width_);
            }
            return this.height_;
        }

        public get size(): number[] {
            return [this.width_, this.height_];
        }

        public exists(x: number, y: number): bool {
            return x >= 0 && x < this.width_ && y >= 0 && y < this.height_;
        }
        
        public fill(value: number): void {
            this.data_ = this.data_.map((obj) => obj = value);
        }

        public get(x: number, y: number): any {
            if (!this.exists(x, y)) {
                throw new Error("OutOfIndexError");
            }
            return this.data_[x + y * this.width_];
        }

        public set(x, y, value): void {
            if (!this.exists(x, y)) {
                throw new Error("OutOfIndexError");
            }
            this.data_[x + y * this.width_] = value;
        }

        public each(callback: (any) => void): void {
            this.data_.forEach((obj) => callback(obj));
        }

        public map(callback: (any)=>void): void {
            this.data_.map((obj) => callback(obj));
        }
        
        public eachWithIndex(callback: (any, number)=>void): void {
            this.data_.forEach((obj, index) => callback(obj, index));
        }

        public eachWithTwoIndex(callback: (o: any, i: number, j: number)=>void): void {
            this.data_.forEach((obj, i) => callback(obj, i % this.width_, i / this.width_));
        }

        public setSize(w: number, h: number): void {
            var t: any[] = [w * h];
            for (var i = 0; i < w; i++) {
                if (i >= this.width_) {
                    break;
                }
                for (var j = 0; j < h; j++) {
                    if (j >= this.height_) {
                        break;
                    }
                    t[i + j * w] = this.get(i, j);
                }
            }
            
            this.width_ = w;
            this.height_ = h;
            this.data_ = t;
        }

    }
}
