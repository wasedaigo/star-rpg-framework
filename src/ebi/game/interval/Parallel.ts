/// <reference path='./IInterval.ts' />

module ebi.game.interval {
    export class Parallel implements IInterval {
        
        private intervals_: IInterval[];
        constructor(intervals: IInterval[]) {
            if (intervals.length === 0) {
                throw Error("Interval of length 0 is passed");
            }

            this.intervals_ = intervals ? intervals : [];
        }

        /*
         *  If all intervals are infinite-loop, this parallel is infinite-loop
         */
        public get isInfiniteLoop(): bool {
            return this.intervals_.every(function(interval: IInterval): bool {
                return interval.isInfiniteLoop;
            });
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            if (this.isInfiniteLoop) {
                // Infinite loop can never finish
                return false;
            } else {
                // Since we know some of intervals are not infinite,
                // We can end this interval once all of non-infinite intervals has finished
                return this.intervals_.every(function(interval: IInterval): bool {
                  return interval.isInfiniteLoop || interval.isDone;
                });
            }
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
            for (var i in this.intervals_) {
                this.intervals_[i].reset();
            }
        }

        /*
         *  Progress the interval
         */ 
        public update(delta: number): void {
            if (!this.isDone) {
                for (var i in this.intervals_) {
                    this.intervals_[i].update(delta);
                }
            }
        }
    }
}