module ebi.game.interval {
    export interface IInterval {
        isDone: bool;
        isInfiniteLoop: bool;
        reset(): void;
        finish(): void;
        update(delta: number): void;
    }
}