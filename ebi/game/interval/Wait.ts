/// <reference path='./IInterval.ts' />
module ebi.game.interval {
    export class Wait implements IInterval {
        /*
         *  Get a value in range based on tween option
         */
        private static completement(start: number, 
                                    end: number, 
                                    proportion: number, 
                                    tween: string): number {
            // Get appropriate completement function
            var func: (start: number, end: number, proportion: number) => number;
            func = this._funcs[tween] ? this._funcs[tween] : this._linear;
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
        private isDone_: bool;
        private func_: any;

        /*
         *  Initialize
         */
        constructor(duration: number, start: number, end: number, tween: string, func: (number)=>any) {
            this.start_ = start;
            this.end_ = end;
            this.duration_ = duration;
            this.frameNo_ = 0;
            this.tween_ = tween ? tween : "linear";
            this.isDone_ = false;
            this.func_ = func;
        }

        /*
         *  Duration of this interval
         */
        public get duration(): number {
            return this.duration_;
        }

        /*
         *  Check whether this interval is finished
         */
        public reset(): void {
            this.frameNo_ = 0;
            this.isDone_ = false;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            return this.frameNo_ >= this.duration_
        }

        /*
         *  Get a value in range based on tween option
         */
        public update(delta: number): void {
            if (!this.isDone_) {
                this.frameNo_ += delta;

                var value: number = Step.completement(this.start_, this.end_, this.frameNo_ / this.duration_, this.tween_);
                this.func_(value);
            }
        }
    }
}