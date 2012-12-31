/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    export interface IDrawable {

        /*
         * Get the Z-order value.
         */
        z: number;

        /*
         * Get the inner object. Don't use this getter in your game.
         */
        innerObject: cc.Node;
    }

}
