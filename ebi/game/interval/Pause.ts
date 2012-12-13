/// <reference path='./IInterval.ts' />
module ebi.game.interval {
    export class Pause implements IInterval {

        /*
         *  Private members
         */
        private isDone_: bool;
        private func_: ()=>bool;

        /*
         *  Initialize
         */
        constructor(func: ()=>bool) {
            this.func_ = func;
            this.isDone_ = false;
        }

        /*
         *  Duration of this interval
         */
        public get duration(): number {
            return 0;
        }

        /*
         *  Check whether this interval is finished
         */
        public reset(): void {
            this.isDone_ = false;
        }

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {
            return this.isDone_;
        }

        /*
         *  Force finish the interval
         */
        public finish(): void {
            this.isDone_ = true;
        }

        /*
         *  Get a value in range based on tween option
         */
        public update(delta: number): void {
            if (!this.isDone) {
                if (this.func_()) {
                    this.isDone_ = true;
                }
            }
        }
    }
}