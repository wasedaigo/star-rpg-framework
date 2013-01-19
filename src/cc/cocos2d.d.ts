/// <reference path='../cp/chipmunk.d.ts' />
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
        preload(res:Object[]): void;
        resourceCount: number;
        loadedResourceCount: number;
        timer: number;
    }
    class LoaderScene {
        static getInstance(): LoaderScene;
        draw(): void;
    }
    class Node {
        addChild(child: Node, zOrder?: number, tag?: number): void;
        getChildByTag(tag: number): Node;
        getChildren(): Node[];
        getPositionX(): number;
        getPositionY(): number;
        getTag(): number;
        removeChild(child: Node, cleanUp?: bool): void;
        removeChildByTag(tag: number): void;
        setVisible(isVisible: bool): void;
        reorderChild(child: Node, zOrder: number);
        setAnchorPoint(point: Point): void;
        setPositionX(x: number): void;
        setPositionY(y: number): void;
        setScaleX(x: number): void;
        setScaleY(y: number): void;
        setTag(tag: number): void;
    }
    class Point {
        constructor(_x: number, _y: number);
        x: number;
        y: number;
    }
    class Size {
        constructor(_width: number, _height: number);
        width: number;
        height: number;
    }
    class Rect {
        constructor(x1: number, y1: number, width1: number, height1: number);
        origin: Point;
        size: Size;
    }
    class SAXParser {
        static getInstance(): SAXParser;
        preloadPlist(path: string): void;
    }
    class Scene extends Node {
        static extend(prop:Object): any;
    }
    class Sprite extends Node {
        static createWithTexture(texture: cc.Image, rect: cc.Rect): cc.Sprite;
        setTextureRect(rect: cc.Rect): void;
        getTextureRect(): cc.Rect;
    }
    class TextureCache {
        static getInstance(): TextureCache;
        addImageAsync(path: string, target: any, selector: () => void);
        textureForKey(key:string): Image;
    }
    class TMXLayer extends Node {
        getLayerName(): string;
        getTiles(): number[];
        getTileSet(): TMXTilesetInfo;
        getTileGIDAt(pos: Point): number;
    }
    class TMXTiledMap extends Node {
        static create(path: string): TMXTiledMap;
        getLayer(name: string): TMXLayer;
        propertiesForGID(gid: number): {};
        getMapSize(): Size;
    }
    class TMXTilesetInfo extends Node {
        firstGid: number;
    }
}
