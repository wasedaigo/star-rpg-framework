/// <reference path='./IInterval.ts' />

module clock.interval {
    export class Loop implements IInterval {

        private currentLoop_: number;
        private loopCount_: number;
        private interval_: IInterval;
        private finished_: bool;
        private forceFinish_: bool;
        constructor(interval: IInterval, loopCount?: number) {
            this.loopCount_ = loopCount ? loopCount : 0;
            this.currentLoop_ = 0;
            this.interval_ = interval;
            this.finished_ = false;
            this.forceFinish_ = false;
        }

        /*
         *  Check whether this interval lasts infinite
         */
        public get isInfiniteLoop(): bool {
            return this.loopCount_ <= 0;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            if (this.forceFinish_) {
                return true;
            }

            if (this.isInfiniteLoop) {
                // Infinite SPLoop never ends
                return false;
            }

            // This is how to determine whether the interval is in the last frame or not
            return this.interval_.isDone && this.currentLoop_ >= this.loopCount_ - 1;
        }

        /*
         *  Force finish the interval
         */
         public finish(): void {
            this.forceFinish_ = true;
         }

        /*
         *  Reset to start state
         */ 
        public reset(): void {
            this.currentLoop_ = 0;
            this.forceFinish_ = false;
            this.interval_.reset();
        }

        /*
         *  Progress the interval
         */ 
        public update(delta: number): void {
            if (!this.isDone) {
                this.interval_.update(delta);
                if (this.interval_.isDone) {
                    this.currentLoop_++;
                    if (this.isInfiniteLoop || this.currentLoop_ < this.loopCount_) {
                        // Repeat this interval again, since this is a subanimation
                        this.interval_.reset();
                    }
                }
            }
        }
    }
}