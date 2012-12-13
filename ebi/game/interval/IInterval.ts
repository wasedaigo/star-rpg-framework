module ebi.game.interval {
    export interface IInterval {
        isDone: bool;
        duration: number;
        reset(): void;
        finish(): void;
        update(delta: number): void;
    }
}