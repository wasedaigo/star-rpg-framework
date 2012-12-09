module cc {

    var COCOS2D_DEBUG;

    function initDebugSetting(): void;
    function rect(x:number, y:number, width:number, height:number):Rect;
    function p(x:number, y:number):Point;
    function PointZero():Point;
    function setup(el: string);
    function setup(el: string, width: string, height: string);

    interface IApplicationClass {
        new(): cc.Application;
    }

    class Application {
        constructor();
        static extend(prop:any): IApplicationClass;
    }

    class Point {
        constructor(x:number, y:number);
        x:number;
        y:number;
    }
    class Size {
        width:number;
        height:number;
    }
    class Rect {
        x:number;
        y:number;
        width:number;
        height:number;
    }

    class Node {
        addChild(child:Node, zOrder?:number, tag?:number): void;
        getChildByTag(tag:string): Node;
        removeChild(removeChild:Node): void;
        setPosition(pos:Point): void;
        getPosition(): Point;
    }

    class Sprite extends Node {
        static createWithTexture(texture:any, rect:Rect):Sprite;
        setTextureRect(rect:any):any;
        setTexture(path:string):any;
        setAnchorPoint(point:Point):void;
    }

    class SpriteBatchNode extends Node {
        static create(path:string, max:number):SpriteBatchNode;
        getTexture():any;
    }

    class Layer extends Node {
        init():void;
        onEnter():void;
        onExit():void;
        setMouseEnabled(value:bool):void;
        setTouchEnabled(value:bool):void;
        onTouchBegan(touch:any, event:any):void;
        onTouchMoved(touch:any, event:any):void;
        onTouchEnded(touch:any, event:any):void;
        onTouchesBegan(touches:any, event:any):void;
        onTouchesMoved(touches:any, event:any):void;
        onTouchesEnded(touches:any, event:any):void;
    }

    class Scene extends Node {
        constructor();
        init():void;
        onEnter():void;
        onExit():void;
        scheduleUpdate():void;
    }

    class LabelTTF extends Node {
    	static create(label:string, fontfamiliy:string, fontsize:number): LabelTTF;
    }
    class Menu extends Node {
    	static create(menuItem:any, option?:any): Menu;
    }
    class MenuItemLabel extends Node {
    	static create(label:LabelTTF, parent:any, callback:any):MenuItemLabel;
    }
    class TMXTiledMap extends Node {
        static create(tmxPath:string) : TMXTiledMap;
        getContentSize() : Size;
        getObjectGroup(id:string) : any;
    }
    class Director {
    	static getInstance(): Director;
        runWithScene(scene:Scene);
        replaceScene(scene:Scene);
        setDisplayStats(fps:string);
        setAnimationInterval(interval:number);
        getWinSize() : Size;
    }
    class TextureCache {
        static getInstance(): TextureCache;
        addImage(path:string): void;
        textureForKey(path:string): any;
    }
    class AudioEngine {
        static getInstance(): AudioEngine;
        init(): void;
        playMusic(path:string, repeat:bool): string;
        stopMusic(): void;
        playEffect(path:string, repeat:bool): string;
        stopEffect(id:string): void;
        unloadEffect(path:string): void;
    }
    class Loader {
        static getInstance(): Loader;
        preload(res:any): void;
        onloading: () => void;
        onload: () => void;
    }
    class LoaderScene {
        static getInstance(): LoaderScene;
        draw(): void;
    }
    class AppController {
        static shareAppController(): AppController;
        didFinishLaunchingWithOptions(): void;
    }
}
