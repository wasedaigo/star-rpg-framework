/// <reference path='./IDrawable.ts' />

module ebi.game {

    /*
     * This class holds all objects to draw on the screen.
     * This class is only for the inner classes of ebi.game.
     * Don't use this class directly for your game.
     */
    export class DisplayObjects {

        private static objectId_: number = 0;

        /*
         * Get the unique Object ID.
         * NOTICE: This method will add the property '_objectID' to the argument.
         */
        private static getObjectId(object: Object): number {
            if (!object) {
                return 0;
            }
            if (!object.hasOwnProperty('_objectId')) {
                objectId_++;
                object['_objectId'] = objectId_;
            }
            return object['_objectId'];
        }

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
