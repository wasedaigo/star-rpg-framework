/// <reference path='./IDrawable.ts' />

/*
 * Append 'id' property to Object.
 * Any objects can have the unique IDs.
 */
(() => {
    var id = 1;

    function generateId() {
        return id++;
    };

    var proto: any = Object.prototype;

    // TODO: Should this be a getter property?
    proto.getId = function() {
        var newId = generateId();
        this.id = () => {
            return newId;
        };
        return newId;
    };
})();

module ebi.game {

    /*
     * Get the unique Object ID.
     */
    function getObjectId(object: Object): number {
        var anyObject: any = object;
        return anyObject.getId();
    }

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

        public static add(drawable: IDrawable): number {
            var id = getObjectId(drawable);
            drawables_[id.toString()] = drawable;
            return id;
        }

        public static remove(drawable: IDrawable): void {
            var id = getObjectId(drawable);
            delete drawables_[id.toString()];
        }

    }

}
