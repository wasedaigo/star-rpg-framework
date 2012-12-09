/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='Scene_Map.ts' />
/// <reference path='Scene_Title.ts' />

module ebi {

    export module rpg {

        /**
         * Starting point of the application
         */
        export function main(config) {
            // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
            //     director->enableRetinaDisplay(true);
            var director:cc.Director = cc.Director.getInstance();

            // turn on display FPS
            director.setDisplayStats(config['showFPS']);

            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / config['frameRate']);

            director.runWithScene(new Scene_Title());
        }

    }

}
