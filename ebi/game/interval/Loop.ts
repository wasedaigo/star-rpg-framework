/// <reference path='./IInterval.ts' />

module ebi.game.interval {
    export class Prallel implements IInterval {

        private isInfiniteLoop_: bool;
        private loopCount_: number;
        private interval_: IInterval;
        private finished_: bool;
        private duration_: number;
        constructor(interval: IInterval, loopCount: number) {
            this.loopCount_ = 0;
            this.loopCount_ = loopCount ? loopCount : 0;
            this.isInfiniteLoop_ = false;
            if (this.loopCount_ == 0) {
                this.isInfiniteLoop_ = true;
            }
            this.interval_ = interval;
            this.finished_ = false;
            this.duration_ = 0;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            var isDone = false;
            if (this.isInfiniteLoop_) {
                // Infinite SPLoop never ends
                isDone = false;
            } else {
                // This is how to determine whether the interval is in the last frame or not
                isDone = this.interval_.isDone && this.loopCount_ >= this.loopCount_ - 1;
            }
            return isDone;
        }

        /*
         *  Force finish the interval
         */
         public finish(): void {
            this.interval_.isDone = true;
         }

        /*
         *  Duration of this interval
         */
        public get duration(): number {
            return this.duration_;
        }

        /*
         *  Reset to start state
         */ 
        public reset(): void {
            this.loopCount_ = 0;
            this.interval_.reset();
        }

        /*
         *  Progress the interval
         */ 
        public update(delta): void {
            if (!this.isDone) {
                this.interval_.update(delta);
                if (this.interval_.isDone) {
                    this.loopCount_++;
                    if (this.isInfiniteLoop_ || this.loopCount_ < this.loopCount_) {
                        // Repeat this interval again, since this is a subanimation
                        this.interval_.reset();
                    }
                }
            }
        }
    }
}