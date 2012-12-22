module cc {

    var COCOS2D_DEBUG;

    function initDebugSetting(): void;
    function setup(el: string);
    function setup(el: string, width: string, height: string);

    class Application {
        static extend(prop:Object): any;
    }
    class AppController {
        static shareAppController(): AppController;
        didFinishLaunchingWithOptions(): void;
    }
    class Director {
    	static getInstance(): Director;
        runWithScene(scene:Scene): void;
        setDisplayStats(fps:string): void;
        setAnimationInterval(interval:number): void;
    }
    class Image {
        height: number;
        width: number;
    }
    class Layer {
        static extend(prop:Object): any;
    }
    class Loader {
        static getInstance(): Loader;
        onloading: () => void;
        onload: () => void;
        preload(res:Object): void;
    }
    class LoaderScene {
        static getInstance(): LoaderScene;
        draw(): void;
    }
    class Node {
        addChild(child: Node): void;
        getChildByTag(tag: number): Node;
        getChildren(): Node[];
        getPositionX(): number;
        getPositionY(): number;
        getTag(): number;
        removeAllChildren(): void;
        removeChild(child: Node): void;
        removeChildByTag(tag: number): void;
        setAnchorPoint(point: Point): void;
        setPositionX(x: number): void;
        setPositionY(y: number): void;
        setTag(tag: number): void;
    }
    class Point {
        constructor(_x: number, _y: number);
    }
    class Rect {
        constructor(x1: number, y1: number, width1: number, height1: number);
    }
    class Scene extends Node {
        static extend(prop:Object): any;
    }
    class Sprite extends Node {
        static createWithTexture(texture: cc.Image, rect: cc.Rect): cc.Sprite;
    }
    class TextureCache {
        static getInstance(): TextureCache;
        addImageAsync(path: string, target: any, selector: () => void);
        textureForKey(key:string): Image;
    }

}
