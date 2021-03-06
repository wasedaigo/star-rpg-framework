/// <reference path='./IInterval.ts' />
module clock.interval {
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
         *  Check whether this interval is finished
         */
        public reset(): void {
            this.isDone_ = false;
        }

        /*
         *  It is not possible to find out Pause can be infinite or not
         *  Assuem it is not.
         */
        public get isInfiniteLoop(): bool {
            return false;
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