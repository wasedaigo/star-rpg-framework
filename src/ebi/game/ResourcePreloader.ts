/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./Image.ts' />
/// <reference path='../util.ts' />

module ebi.game {

    export class ResourcePreloader {

        private static images_: {[id: string]: Image;} = {};
        private static json_ = {};
        private static loadingCount_: number = 0;

        public static preloadImage(id: string): void {
            loadingCount_++;
            Image.load('res/images/' + id + '.png', (loadedImage) => {
                images_[id] = loadedImage;
                loadingCount_--;
            });
        }

        public static preloadTmx(id: string): void {
            // This method will read the tmx file synchronously.
            cc.SAXParser.getInstance().preloadPlist('res/tmx/' + id + '.tmx');
        }

        public static preloadTmxImage(id: string): void {
            loadingCount_++;
            Image.load('res/tmx/images/' + id + '.png', (loadedImage) => {
                images_[id] = loadedImage;
                loadingCount_--;
            });
        }

        public static getImage(id: string): Image {
            ebi.assert(!!images_[id], "no valid id: " + id);
            return images_[id];
        }

        // Hack to preload fixed data
        public static preloadJson(path: string): void {
            var utils = new cc.FileUtils();
            var test = utils.getFileData("res/data/event0.json");
            json_[path] = JSON.parse(test);
        }

        public static getJson(path: string): Image {
            return json_[path];
        }

        public static get isLoading(): bool {
            return 0 < loadingCount_;
        }

    }

}
