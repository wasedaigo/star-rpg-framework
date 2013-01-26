var ebi;
(function (ebi) {
    (function (game) {
        var ResourcePreloader = (function () {
            function ResourcePreloader() { }
            ResourcePreloader.images_ = {
            };
            ResourcePreloader.json_ = {
            };
            ResourcePreloader.loadingCount_ = 0;
            ResourcePreloader.preloadImage = function preloadImage(id) {
                ResourcePreloader.loadingCount_++;
                game.Image.load('res/images/' + id + '.png', function (loadedImage) {
                    ResourcePreloader.images_[id] = loadedImage;
                    ResourcePreloader.loadingCount_--;
                });
            }
            ResourcePreloader.preloadTmx = function preloadTmx(id) {
                cc.SAXParser.getInstance().preloadPlist('res/tmx/' + id + '.tmx');
            }
            ResourcePreloader.preloadTmxImage = function preloadTmxImage(id) {
                ResourcePreloader.loadingCount_++;
                game.Image.load('res/tmx/images/' + id + '.png', function (loadedImage) {
                    ResourcePreloader.images_[id] = loadedImage;
                    ResourcePreloader.loadingCount_--;
                });
            }
            ResourcePreloader.getImage = function getImage(id) {
                return ResourcePreloader.images_[id];
            }
            ResourcePreloader.preloadJson = function preloadJson(path) {
                ResourcePreloader.json_[path] = {
                    "1": [
                        [
                            [
                                [
                                    1, 
                                    255, 
                                    6, 
                                    1, 
                                    1, 
                                    5, 
                                    1, 
                                    1, 
                                    1, 
                                    0, 
                                    0, 
                                    0, 
                                    1, 
                                    0, 
                                    0, 
                                    0, 
                                    
                                ], 
                                [], 
                                [
                                    0, 
                                    0
                                ], 
                                [], 
                                []
                            ]
                        ], 
                        [
                            7, 
                            6
                        ]
                    ]
                };
            }
            ResourcePreloader.getJson = function getJson(path) {
                return ResourcePreloader.json_[path];
            }
            Object.defineProperty(ResourcePreloader, "isLoading", {
                get: function () {
                    return 0 < ResourcePreloader.loadingCount_;
                },
                enumerable: true,
                configurable: true
            });
            return ResourcePreloader;
        })();
        game.ResourcePreloader = ResourcePreloader;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

