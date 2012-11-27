module cc {
    export class Point {
        constructor(x:number, y:number);
        x:number;
        y:number;
    }
    export class Size {
        width:number;
        height:number;
    }
    export class Rect {
        x:number;
        y:number;
        width:number;
        height:number;
    }
    export function rect(x:number, y:number, width:number, height:number):Rect;
	export function p(x:number, y:number):Point;
	export function PointZero():Point;

    export class Node {
        addChild(child:Node, zOrder?:number, tag?:number): void;
        getChildByTag(tag:string): Node;
        removeChild(removeChild:Node): void;
        setPosition(pos:Point): void;
    }

    export class Sprite extends Node {
        static createWithTexture(texture:any, rect:Rect):Sprite;
    }

    export class SpriteBatchNode extends Node {
        static create(path:string, max:number):SpriteBatchNode;
        getTexture():any;
    }

    export class Layer extends Node {
        onEnter():void;
        onExit():void;
    }

    export class Scene extends Node {
        constructor();
        init():void;
        onEnter():void;
        onExit():void;
        scheduleUpdate():void;
    }

    export class LabelTTF extends Node {
    	static create(label:string, fontfamiliy:string, fontsize:number): LabelTTF;
    }
    export class Menu extends Node {
    	static create(menuItem:any, option?:any): Menu;
    }
    export class MenuItemLabel extends Node {
    	static create(label:LabelTTF, parent:any, callback:any):MenuItemLabel;
    }
    export class TMXTiledMap extends Node {
        static create(tmxPath:string) : TMXTiledMap;
        getContentSize() : Size;
        getObjectGroup(id:string) : any;
    }
    export class Director {
    	static getInstance() : Director;
        runWithScene(scene:Scene);
        replaceScene(scene:Scene);
        setDisplayStats(fps:string);
        setAnimationInterval(interval:number);
        getWinSize() : Size;
    }
}