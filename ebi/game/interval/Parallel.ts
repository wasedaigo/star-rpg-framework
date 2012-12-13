/// <reference path='./IInterval.ts' />

module ebi.game.interval {
    export class Prallel implements IInterval {
        
        private intervals_: IInterval[];
        private duration_: number;

        constructor(intervals: IInterval[]) {
            if (intervals.length === 0) {
                throw Error("Interval of length 0 is passed");
            }

            var durations: number[] = this.intervals_.map(
                    (interval: IInterval) => interval.duration
            );
            this.duration_ = Math.max.apply(durations);

            this.intervals_ = intervals ? intervals : [];;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            var isDone = true;
            for (var i in this.intervals_) {
                if (!this.intervals_[i].isInfiniteLoop && !this.intervals_[i].isDone) {
                    isDone = false;
                    break;
                }
            }
            return isDone;
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