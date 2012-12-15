/// <reference path='../game/Game.ts' />

module ebi {
    export module rpg {

        export class Main {
            public static main(): void {
                ebi.game.Game.run(function () {
                    console.log('Update!');
                });
            }
        }

    }
}
