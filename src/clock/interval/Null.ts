/// <reference path='./IInterval.ts' />
module clock.interval {
    export class Null implements IInterval {

        /*
         *  Check whether this interval is finished
         */
        public reset(): void {}

        /*
         *  Func can never be infinite
         */
        public get isInfiniteLoop(): bool {return false;}

        /*
         *  Check whether this interval is finished
         */
        public get isDone(): bool {return true;}

        /*
         *  Force finish the interval
         */
        public finish(): void {}

        /*
         *  Get a value in range based on tween option
         */
        public update(delta: number): void {}
    }
}