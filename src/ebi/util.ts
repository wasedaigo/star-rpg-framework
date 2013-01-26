module ebi {
    export function assert(expr: bool): void {
        if (!expr) {
            throw new Error('Assertion failed');
        }
    }

}
