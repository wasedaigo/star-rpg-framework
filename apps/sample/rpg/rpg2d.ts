///<reference path='../cocos2d.d.ts'/>
module rpg2d {
    export class Point extends cc.Point {};
    export class Size extends cc.Size {};
    export function MakePoint(x:number, y:number):Point {return new Point(x, y);};
    export function PointZero():Point {return new Point(0, 0);};

    export class Label extends cc.LabelTTF {
        static create(text:string, fontfamiliy:string, fontsize:number): Label {
            return <Label>cc.LabelTTF.create(text, fontfamiliy, fontsize);
        }
    }

    export class Scene extends cc.Scene {
        public onEnter(): void {
            super.onEnter();
            this.scheduleUpdate();
        }

        public update(dt:number): void {}
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