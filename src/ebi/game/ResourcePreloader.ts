/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./Image.ts' />

module ebi.game {

    export class ResourcePreloader {

        private static images_: {[id: string]: Image;} = {};
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
            return images_[id];
        }

        public static get isLoading(): bool {
            return 0 < loadingCount_;
        }

    }

}
