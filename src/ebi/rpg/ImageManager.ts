module ebi.rpg {
    export class ImageManager {
        private static images: {} = {};
        private static prefix: string = 'res/images/';
        private static loadingCount: number = 0;

        public static preloadImage(id: string): void {
            loadingCount++;
            ebi.game.Image.load(prefix + id + ".png", (loadedImage) => {
                images[id] = loadedImage;
                loadingCount--;
            }); 
        }

        public static getImage(id: string): ebi.game.Image {
            return images[id];
        }

        public static isLoading(): bool {
            return loadingCount === 0;
        }

        public static clear(): void {
            // TODO unload images
            //images = {};
        }
    }
}
