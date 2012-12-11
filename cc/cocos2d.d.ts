module cc {

    var COCOS2D_DEBUG;

    function initDebugSetting(): void;
    function setup(el: string);
    function setup(el: string, width: string, height: string);

    interface IApplicationClass {
        new(): cc.Application;
    }
    class Application {
        constructor();
        static extend(prop:Object): IApplicationClass;
    }
    class AppController {
        static shareAppController(): AppController;
        didFinishLaunchingWithOptions(): void;
    }
    class Director {
    	static getInstance(): Director;
        runWithScene(scene:Scene);
        setDisplayStats(fps:string);
        setAnimationInterval(interval:number);
    }
    interface ILayer {
        new(): cc.Layer;
    }
    class Layer {
        static extend(prop:Object): ILayer;
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
    interface IScene {
        new(): cc.Scene;
    }
    class Scene {
        static extend(prop:Object): IScene;
    }

}
