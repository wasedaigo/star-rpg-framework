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
        runWithScene(scene:Scene);
        setDisplayStats(fps:string);
        setAnimationInterval(interval:number);
    }
    class Layer {
        static extend(prop:Object): any;
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
    class Scene {
        static extend(prop:Object): any;
    }

}
