var ebi;
(function (ebi) {
    (function (rpg) {
        (function (core) {
            var DatabaseManager = (function () {
                function DatabaseManager() { }
                DatabaseManager.charaChipsetData = {
                    "1": {
                        "src": "characters/chara01",
                        "srcIndex": [
                            0, 
                            0
                        ],
                        "size": [
                            32, 
                            48
                        ],
                        "dirCount": 4,
                        "frameCount": 3,
                        "defaultFrameNo": 0,
                        "hitRect": [
                            0, 
                            0, 
                            16, 
                            16
                        ]
                    },
                    "2": {
                        "src": "characters/chara01",
                        "srcIndex": [
                            3, 
                            1
                        ],
                        "size": [
                            32, 
                            48
                        ],
                        "dirCount": 4,
                        "frameCount": 3,
                        "defaultFrameNo": 1,
                        "hitRect": [
                            0, 
                            0, 
                            16, 
                            16
                        ]
                    },
                    "3": {
                        "src": "characters/chara01",
                        "srcIndex": [
                            1, 
                            1
                        ],
                        "size": [
                            32, 
                            48
                        ],
                        "dirCount": 4,
                        "frameCount": 3,
                        "defaultFrameNo": 2,
                        "hitRect": [
                            0, 
                            0, 
                            16, 
                            16
                        ]
                    }
                };
                DatabaseManager.mapCharacterChipsets = {
                };
                DatabaseManager.loadCharaChipsetData = function loadCharaChipsetData(id) {
                    var data = DatabaseManager.charaChipsetData[id.toString()];
                    var chipset = new rpg.map.MapCharacterChipset();
                    chipset.src = data['src'];
                    chipset.srcIndex = data['srcIndex'];
                    chipset.size = data['size'];
                    chipset.dirCount = data['dirCount'];
                    chipset.frameCount = data['frameCount'];
                    chipset.defaultFrameNo = data['defaultFrameNo'];
                    chipset.hitRect = data['hitRect'];
                    DatabaseManager.mapCharacterChipsets[id] = chipset;
                    ebi.game.ResourcePreloader.preloadImage(chipset.src);
                }
                DatabaseManager.getCharaChipsetData = function getCharaChipsetData(id) {
                    return DatabaseManager.mapCharacterChipsets[id];
                }
                return DatabaseManager;
            })();
            core.DatabaseManager = DatabaseManager;            
        })(rpg.core || (rpg.core = {}));
        var core = rpg.core;

    })(ebi.rpg || (ebi.rpg = {}));
    var rpg = ebi.rpg;

})(ebi || (ebi = {}));

