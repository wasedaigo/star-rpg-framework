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
        getHeight(): number;
        getWidth(): number;
    }
    class Layer {
        static extend(prop:Object): any;
    }
    class Loader {
        static getInstance(): Loader;
        onloading: () => void;
        onload: () => void;
        preload(res:any): void;
    }
    class LoaderScene {
        static getInstance(): LoaderScene;
        draw(): void;
    }
    class Scene {
        static extend(prop:Object): any;
    }
    class TextureCache {
        static getInstance(): TextureCache;
        addImageAsync(path: string, target: any, selector: () => void);
        textureForKey(key:string): Image;
    }

}
