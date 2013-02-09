module ebi {
    export function assert(expr: bool, message: string): void {
        if (!expr) {
            throw new Error('Assertion failed: ' + message);
        }
    }

}
