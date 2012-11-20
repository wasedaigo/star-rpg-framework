module cc {
    export class Point {
        x:number;
        y:number;
    }
    export class Size {
        width:number;
        height:number;
    }
	export function p(x:number, y:number):Point;
	export function PointZero():Point;
    export class Scene {
        constructor();
    	addChild(obj:any): void;
    	init():void;
    	onEnter():void;
    	onExit():void;
    }
    export class Node {
        addChild(child:Node, zOrder?:number, tag?:number): void;
        setPosition(pos:Point): void;
    }
    export class Layer extends Node {
        onEnter():void;
        onExit():void;
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
    }
    export class Director {
    	static getInstance() : Director;
        replaceScene(scene:Scene);
        getWinSize() : Size;
    }
}