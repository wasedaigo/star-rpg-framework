/// <reference path='../game/ResourcePreloader.ts' />

module ebi.rpg {
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

        private static mapCharacterChipsets: {} = {};

        public static loadCharaChipsetData(id: number): void {
            var data = charaChipsetData[id.toString()];
            var chipset = new MapCharacterChipset();
            chipset.src = data['src'];
            chipset.srcIndex = data['srcIndex'];
            chipset.size = data['size'];
            chipset.dirCount = data['dirCount'];
            chipset.frameCount = data['frameCount'];
            chipset.defaultFrameNo = data['defaultFrameNo'];
            chipset.hitRect = data['hitRect'];
            mapCharacterChipsets[id] = chipset;
            ebi.game.ResourcePreloader.preloadImage(chipset.src);
        }

        /*public static unloadCharaChipsetData(id: number): void {
            if (mapCharacterChipsets[id]) {
                ebi.game.ResourcePreloader.unloadImage(mapCharacterChipsets[id].src);
                delete mapCharacterChipsets[id];
            }
        }*/

        public static getCharaChipsetData(id: number): MapCharacterChipset {
            return mapCharacterChipsets[id];
        }
    }
}
