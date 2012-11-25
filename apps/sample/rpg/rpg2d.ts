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

    export class Menu extends cc.Menu {
        static create(menuItem:any, option?:any): Menu {
            return <Menu>cc.Menu.create(menuItem, option);
        }
    }

    export class MenuItemLabel extends cc.MenuItemLabel {
        static create(label:cc.LabelTTF, parent:any, callback:any):MenuItemLabel {
            return <MenuItemLabel>cc.MenuItemLabel.create(label, parent, callback);
        }
    }

    export class TileMap extends cc.TMXTiledMap {
        static create(tmxPath:string) : TileMap {
            return <TileMap>cc.TMXTiledMap.create(tmxPath);
        }
        public getContentSize() : Size {
            return <Size>this.getContentSize();
        }
    }

    export class Scene extends cc.Scene {
        public onEnter(): void {
            super.onEnter();
            this.scheduleUpdate();
        }

        public addChild(child:cc.Node, zOrder?:number, tag?:number): void {
            super.addChild(child, zOrder, tag);
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

        export function getWinSize() : Size {
            return <Size>cc.Director.getInstance().getWinSize();
        }
    }
}