/// <reference path='./IDrawable.ts' />

/*
 * Append 'id' property to Object.
 * Any objects can have the unique IDs.
 */
(() => {
    var id = 0;

    function generateId() {
        return id++;
    };

    var proto: any = Object.prototype;
    proto.getId = function() {
        var newId = generateId();
        this.id = () => {
            return newId;
        };
        return newId;
    };
})();

/*
 * Get the unique Object ID.
 */
function getObjectId(object: Object): number {
    var anyObject: any = object;
    return anyObject.getId();
}

module ebi.game {

    /*
     * This class holds all objects to draw on the screen.
     * This class is only for the inner classes of ebi.game.
     * Don't use this class directly for your game.
     */
    export class DisplayObjects {

        private static drawables_: Object = {};

        public static get drawables(): IDrawable[] {
            return Object.keys(drawables_).map((idStr: string) => drawables_[idStr]);
        }

        public static add(drawable: IDrawable): void {
            var id = getObjectId(drawable);
            drawables_[id.toString()] = drawable;
        }

        public static remove(drawable: IDrawable): void {
            var id = getObjectId(drawable);
            delete drawables_[id.toString()];
        }

    }

}
