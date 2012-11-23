///<reference path='../cocos2d.d.ts'/>
module rpg2d {
    export class Scene extends cc.Scene {
        public onEnter() {
            super.onEnter();
            this.scheduleUpdate();
        }
    }

    export module SceneDirector {
        export function runWithScene(scene:Scene, config:any) {
            var director:cc.Director = cc.Director.getInstance();

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);

            // turn on display FPS
            director.setDisplayStats(config['showFPS']);

            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / config['frameRate']);

            director.runWithScene(scene);
            console.log("runWithScene");
        }

        export function replaceScene(scene:cc.Scene) {
            cc.Director.getInstance().replaceScene(scene);
        }
    }
}