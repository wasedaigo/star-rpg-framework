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

        private static drawablesToAdd_: IDrawable[] = [];
        private static drawablesToRemove_: IDrawable[] = [];
        private static drawablesToReorder_: IDrawable[] = [];

        public static get drawablesToAdd(): IDrawable[] {
            // TODO: Clone?
            return drawablesToAdd_;
        }

        public static get drawablesToRemove(): IDrawable[] {
            // TODO: Clone?
            return drawablesToRemove_;
        }

        public static get drawablesToReorder(): IDrawable[] {
            // TODO: Clone?
            return drawablesToReorder_;
        }

        public static add(drawable: IDrawable): number {
            var id = getObjectId(drawable);
            drawablesToAdd_.push(drawable);
            return id;
        }

        public static clearDrawablesToAdd(): void {
            drawablesToAdd_.length = 0;
        }

        public static remove(drawable: IDrawable): void {
            drawablesToRemove_.push(drawable);
        }

        public static clearDrawablesToRemove(): void {
            drawablesToRemove_.length = 0;
        }

        // TODO: Rename this method
        public static addDrawableToReorder(drawable: IDrawable): void {
            drawablesToReorder_.push(drawable);
        }

        public static clearDrawablesToReorder(): void {
            drawablesToReorder_.length = 0;
        }

    }

}
