module cc {
	export function p(x:number, y:number):any;
	export function PointZero():any;
    export class Scene {
        constructor();
    	addChild(obj:any): void;
    	init():void;
    	onEnter():void;
    	onExit():void;
    }
    export class Layer {
        constructor();
        addChild(obj:any, depth?:number, tag?:number): void;
        onEnter():void;
        onExit():void;
    }
    export class LabelTTF {
    	static create(label:string, fontfamiliy:string, fontsize:number);
    }
    export class Menu {
    	static create(menuItem:any, option?:any);
    }
    export class MenuItemLabel {
    	static create(label:string, parent:any, callback:any);
    }
    export class TMXTiledMap {
        static create(tmxPath:string) : TMXTiledMap;
        getContentSize() : any;
    }
    export class Director {
    	static getInstance() : Director;
        replaceScene(scene:Scene);
        getWinSize() : any;
    }
}