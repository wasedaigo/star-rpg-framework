module ebi.rpg {
    export class ResourceManager {
        private static images: {} = {};
        private static loadingCount: number = 0;

        public static preloadImage(id: string): void {
            loadingCount++;
            ebi.game.Image.load('res/images/' + id + ".png", (loadedImage) => {
                images[id] = loadedImage;
                loadingCount--;
            }); 
        }

        public static unloadImage(id: string): void {
            delete images[id];
        }

        public static preloadTmxImage(id: string): void {
            loadingCount++;
            ebi.game.Image.load('res/tmx/images/' + id + ".png", (loadedImage) => {
                images[id] = loadedImage;
                loadingCount--;
            }); 
        }

        public static preloadTmx(id: string): void {
            loadingCount++;
            cc.SAXParser.getInstance().preloadPlist("res/tmx/" + id + ".tmx");
        }

        public static getImage(id: string): ebi.game.Image {
            return images[id];
        }

        public static isLoading(): bool {
            var loader: cc.Loader = cc.Loader.getInstance();
            if (loader.loadedResourceCount > 0) {
                loadingCount -= loader.loadedResourceCount;
                loader.loadedResourceCount = 0;
            }
            
            return loadingCount > 0;
        }

        public static clear(): void {
            // TODO unload images
            //images = {};
        }

        public static update(): void {

        }
    }
}
