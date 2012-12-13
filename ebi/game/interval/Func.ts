/// <reference path='./IInterval.ts' />
module ebi.game.interval {
    export class Func implements IInterval {
        /*
         *  Private members
         */
        private isDone_: bool;
        private func_: any;

        /*
         *  Initialize
         */
        constructor(func: (Func)=>any) {
            this.isDone_ = false;
            this.func_ = func;
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
            if (!this.isDone_) {
                this.func_(this);
                this.isDone_ = true;
            }
        }
    }
}