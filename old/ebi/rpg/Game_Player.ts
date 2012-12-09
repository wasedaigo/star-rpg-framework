/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./Sprite_Character.ts' />

module ebi {

    export module rpg {

        /**
         * Game_Player
         *
         * The only one instance in GameScene
         *
         */
        export class Game_Player extends Sprite_Character {
            /**
             * Initialize all layers
             */
            constructor(root) {
                super(root);
            }

            public moveTo(x:number, y:number) {
                this.addCommand("moveTo", {x:x, y:y});
            }

            public update(dt: number) {
                super.update(dt);
            }
        }

    }

}