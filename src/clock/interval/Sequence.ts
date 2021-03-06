/// <reference path='./IInterval.ts' />

module clock.interval {
    export class Sequence implements IInterval {
        
        private intervals_: IInterval[];
        private lastInterval_: IInterval;
        private index_: number;
        
        constructor(intervals: IInterval[]) {
            if (intervals.length === 0) {
                throw Error("Interval of length 0 is passed");
            }
            this.intervals_ = intervals ? intervals : [];
            this.index_ = 0;
            this.lastInterval_ = this.intervals_[this.intervals_.length - 1];
        }
        
        /*
         *  If any of intervals is infinite, this interval is infinite
         */
        public get isInfiniteLoop(): bool {
            return this.intervals_.some(function(interval: IInterval): bool {
                return interval.isInfiniteLoop;
            });
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            // If no interval is added, it can be regarded as done
            return !this.lastInterval_ || this.lastInterval_.isDone;
        }

        /*
         *  Force finish the interval
         */
         public finish(): void {
            for (var i in this.intervals_) {
                this.intervals_[i].finish();
            }
        }

        /*
         *  Reset to start state
         */ 
        public reset(): void {
            this.index_ = 0;
            for (var i in this.intervals_) {
                this.intervals_[i].reset();
            }
        } 
        
        /*
         *  Progress the interval
         */ 
        public update(delta: number): void {
            if (!this.isDone) {
                var currentInterval = this.intervals_[this.index_];
                currentInterval.update(delta);
                if (currentInterval.isDone) {
                    this.index_++;
                    if (currentInterval instanceof Func || currentInterval instanceof  Pause) {
                        this.update(delta);
                    }
                }
            }
        }
    }
}
