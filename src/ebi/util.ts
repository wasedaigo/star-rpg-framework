module ebi {
    export function assert(expr: bool, message: string): void {
        if (!expr) {
            throw new Error('Assertion failed: ' + message);
        }
    }

    // value less than min will be invalid
    // value more than max will be rounded to max
    // This function handles both positive/negative case
    export function cropValue(value, min, max): number {

        if (value > 0) {
            value = value < min ? 0: value;
            value = value > max ? max: value;
        } else {
            value = value > min ? 0: value;
            value = value < -max ? -max: value;
        }

        return value;
    }
}
