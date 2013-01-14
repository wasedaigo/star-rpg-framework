module ebi.game {

    export assert(expr: bool): void {
        if (!expr) {
            throw 'Assertion failed';
        }
    }

}
