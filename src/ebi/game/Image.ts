/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    export class Image {

        public static load(path:string, callback: (Image) => void): void {
            var ccCache = cc.TextureCache.getInstance();
            // The 2nd arguemnt should not be null (nor false) to call the callback.
            ccCache.addImageAsync(path, true, () => {
                var ccImage = ccCache.textureForKey(path);
                callback(new Image(ccImage, path));
            });
        }

        private ccImage_: cc.Image;
        private path_: string;

        // This should be private.
        constructor(ccImage: cc.Image, path: string) {
            this.ccImage_ = ccImage;
            this.path_ = path;
        }

        public get width(): number {
            return this.ccImage_.width;
        }

        public get height(): number {
            return this.ccImage_.height;
        }

        public get path(): string {
            return this.path_;
        }

        /*
         * Don't use in the game.
         */
        public get innerImage(): cc.Image {
            return this.ccImage_;
        }

    }

}
