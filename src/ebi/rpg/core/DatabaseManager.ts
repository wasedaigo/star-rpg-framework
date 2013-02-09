/// <reference path='../Const.ts' />
/// <reference path='../../game/ResourcePreloader.ts' />

module ebi.rpg.core {
    export class DatabaseManager {
        public static charaChipsetData = {
            "1": {
                "src": "characters/chara01",
                "srcIndex": [0, 0],
                "size": [32, 48],
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 0,
                "hitRect": [0, 0, 16, 16]
            },
            "2": {
                "src": "characters/chara01",
                "srcIndex": [3, 1],
                "size": [32, 48],
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 1,
                "hitRect": [0, 0, 16, 16]
            },
            "3": {
                "src": "characters/chara01",
                "srcIndex": [1, 1],
                "size": [32, 48],
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 2,
                "hitRect": [0, 0, 16, 16]
            },     
        };

        private static defaultChipset: map.MapCharacterChipset = null;
        private static mapCharacterChipsets: {} = {};
        public static init(): void {
            // Setup default chipset (Which has no image)
            defaultChipset = new map.MapCharacterChipset();
            defaultChipset.src = null;
            defaultChipset.srcIndex = [0, 0];
            defaultChipset.size = [ebi.Const.GridWidth, ebi.Const.GridHeight];
            defaultChipset.dirCount = 1;
            defaultChipset.frameCount = 1;
            defaultChipset.defaultFrameNo = 0;
            defaultChipset.hitRect = [0, 0, ebi.Const.GridWidth, ebi.Const.GridHeight]

            for (var i in charaChipsetData) {
                var data = charaChipsetData[i];
                var chipset = new map.MapCharacterChipset();
                chipset.src = data['src'];
                chipset.srcIndex = data['srcIndex'];
                chipset.size = data['size'];
                chipset.dirCount = data['dirCount'];
                chipset.frameCount = data['frameCount'];
                chipset.defaultFrameNo = data['defaultFrameNo'];
                chipset.hitRect = data['hitRect'];
                mapCharacterChipsets[parseInt(i)] = chipset;
            }
        }

        public static getCharaChipsetData(id: number): map.MapCharacterChipset {
            var chipset = mapCharacterChipsets[id];
            if (chipset) {
                return chipset;
            } else {
                return defaultChipset;
            }
        }
    }
}
