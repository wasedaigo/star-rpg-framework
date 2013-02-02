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
            ebi.assert(!!images_[id]);
            return images_[id];
        }

        // Hack to preload fixed data
        public static preloadJson(path: string): void {
            json_[path] = {
                "1": [
                    [ //"pages": 
                        [
                            [//"status": 
                                1, //"visible": true,
                                255, //"alpha": 255,
                                6, //"dir": 6,
                                1, //"frame_no": 1,
                                1, //"chip_id": "TimeOver_chara",
                                5, //"wait": 5,
                                1, //"speed": 1,
                                1, //"layer": 1,
                                1, //"route_repeat": true,
                                0, //"route_skip": false
                                0, //"dir_fix": false,
                                0, //"stay_anime": false,
                                1, //"move_anime": true,
                                0, //"pass_event": false,
                                0, //"pass_character": false,
                                0, //"pass_tile": false
                            ],
                            [], //"conditions": [],
                            [0, 0], //"triggers": [["checked", 0]],
                            [], //"commands": [],
                            [] //"route": [],
                        ]
                    ],
                    [132, 64]//"pos": [7, 6]
                ]
            };
        }

        public static getJson(path: string): Image {
            return json_[path];
        }

        public static get isLoading(): bool {
            return 0 < loadingCount_;
        }

    }

}
