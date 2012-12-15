module clock.interval {
    export interface IInterval {
        isDone: bool;
        isInfiniteLoop: bool;
        reset(): void;
        finish(): void;
        update(delta: number): void;
    }
}