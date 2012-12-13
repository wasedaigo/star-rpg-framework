/// <reference path='./IInterval.ts' />

module ebi.game.interval {
    export class Sequence implements IInterval {
        
        private intervals_: IInterval[];
        private lastInterval_: IInterval;
        private index_: number;
        private duration_: number;
        
        constructor(intervals: IInterval[]) {
            if (intervals.length === 0) {
                throw Error("Interval of length 0 is passed");
            }

            var duration = 0;
            this.intervals_.forEach((interval: IInterval) => {
                duration += interval.duration;
            });
            this.duration_ = duration;

            this.intervals_ = intervals ? intervals : [];
            this.index_ = 0;
            this.lastInterval_ = this.intervals_[this.intervals_.length - 1];
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
         *  Duration of this interval
         */
        public get duration(): number {
            return this.duration_;
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
                    if (currentInterval.duration == 0) {
                        this.update(delta);
                    }
                }
            }
        }
    }
}
