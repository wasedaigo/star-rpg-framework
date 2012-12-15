/// <reference path='./IInterval.ts' />
module clock.interval {
    export class Wait implements IInterval {

        /*
         *  Private members
         */
        private duration_: number;
        private frameNo_: number;
        private func_: (Wait, number)=>void;

        /*
         *  Initialize
         */
        constructor(duration: number, func?: (Wait, number)=>void) {
            this.duration_ = duration;
            this.frameNo_ = 0;
            this.func_ = func;
        }

        /*
         *  Check whether this interval is finished
         */
        public reset(): void {
            this.frameNo_ = 0;
        }

        /*
         *  Wait cannot be infinite
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
                if (this.func_) {
                    this.func_(this, this.frameNo_);
                }
            }
        }
    }
}