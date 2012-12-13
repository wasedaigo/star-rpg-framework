/// <reference path='./IInterval.ts' />

module ebi.game.interval {
    export class Loop implements IInterval {

        private isInfiniteLoop_: bool;
        private currentLoop_: number;
        private loopCount_: number;
        private interval_: IInterval;
        private finished_: bool;
        private duration_: number;
        private forceFinish_: bool;
        constructor(interval: IInterval, loopCount?: number) {
            this.loopCount_ = loopCount ? loopCount : 0;
            this.isInfiniteLoop_ = false;
            this.currentLoop_ = 0;
            if (this.loopCount_ <= 0) {
                this.isInfiniteLoop_ = true;
            }
            this.interval_ = interval;
            this.finished_ = false;
            this.duration_ = 0;
            this.forceFinish_ = false;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            if (this.forceFinish_) {
                return true;
            }

            if (this.isInfiniteLoop_) {
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
         *  Duration of this interval
         */
        public get duration(): number {
            return this.duration_;
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
        public update(delta): void {
            if (!this.isDone) {
                this.interval_.update(delta);
                if (this.interval_.isDone) {
                    this.currentLoop_++;
                    if (this.isInfiniteLoop_ || this.currentLoop_ < this.loopCount_) {
                        // Repeat this interval again, since this is a subanimation
                        this.interval_.reset();
                    }
                }
            }
        }
    }
}