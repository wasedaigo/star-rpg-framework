/// <reference path='./IInterval.ts' />
module clock.interval {
    export class Lerp implements IInterval {

        /*
         *  List of completement methods
         */
        private static _funcs = {
            "linear": (start: number, end: number, proportion: number): number => {
                return start + (end - start) * proportion;
            },
            "easeIn": (start: number, end: number, proportion: number): number => {
                return start + (end - start) * proportion * proportion;
            },
            "easeOut": (start: number, end: number, proportion: number): number => {
                return start + (end - start) * Math.sqrt(proportion);
            },
            "easeInOut": (start: number, end: number, proportion: number): number => {
                if (proportion < 0.5 ) {
                    return start + (end - start) * proportion * proportion;
                } else {
                    return start + (end - start) * Math.sqrt(proportion);
                } 
            }
        };

        /*
         *  Get a value in range based on tween option
         */
        private static completement(start: number, 
                                    end: number, 
                                    proportion: number, 
                                    tween: string): number {
            // Get appropriate completement function
            var func: (start: number, end: number, proportion: number) => number;
            func = Lerp._funcs[tween] ? Lerp._funcs[tween] : Lerp._funcs["linear"];
            return func(start, end, proportion);
        }

        /*
         *  Private members
         */
        private start_: number;
        private end_: number;
        private duration_: number;
        private frameNo_: number;
        private tween_: string;
        private func_: (Lerp, number)=>void;

        /*
         *  Initialize
         */
        constructor(duration: number, start: number, end: number, tween: string, func?: (Lerp, number)=>void) {
            this.start_ = start;
            this.end_ = end;
            this.duration_ = duration;
            this.frameNo_ = 0;
            this.tween_ = tween ? tween : "linear";
            this.func_ = func;
        }

        /*
         *  Check whether this interval is finished
         */
        public reset(): void {
            this.frameNo_ = 0;
        }

        /*
         *  Lerp cannot be infinite
         */
        public get isInfiniteLoop(): bool {
            return false;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            return this.frameNo_ >= this.duration_;
        }

        /*
         *  Force finish the interval
         */
        public finish(): void {
            this.frameNo_ = this.duration_;
        }

        /*
         *  Get a value in range based on tween option
         */
        public update(delta: number): void {
            if (!this.isDone) {
                this.frameNo_ += delta;
                var value: number = Lerp.completement(this.start_, this.end_, this.frameNo_ / this.duration_, this.tween_);
                if (this.func_) {
                    this.func_(this, value);
                }
            }
        }
    }
}