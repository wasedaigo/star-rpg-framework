module ebi.rpg {
    export class DatabaseManager {
        public static charaChipsetData = {
            "1": {
                "src": "characters/chara01",
                "indexW": 0,
                "indexH": 0,
                "sizeX": 32,
                "sizeY": 48,
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 0,
                "hitTop": 0,
                "hitLeft": 0,
                "hitWidth": 16,
                "hitHeight": 16
            },
            "2": {
                "src": "characters/chara01",
                "indexW": 1,
                "indexH": 0,
                "sizeX": 32,
                "sizeY": 48,
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 1,
                "hitTop": 0,
                "hitLeft": 0,
                "hitWidth": 16,
                "hitHeight": 16
            },
            "3": {
                "src": "characters/chara01",
                "indexW": 1,
                "indexH": 1,
                "sizeX": 32,
                "sizeY": 48,
                "dirCount": 4,
                "frameCount": 3,
                "defaultFrameNo": 2,
                "hitTop": 0,
                "hitLeft": 0,
                "hitWidth": 16,
                "hitHeight": 16
            },     
        };

        private static mapCharacterChipsets: {} = {};

        public static loadCharaChipsetData(id: number): void {
            var data = charaChipsetData[id.toString()];
            var chipset = new MapCharacterChipset();
            chipset.src = data['src'];
            chipset.indexW = data['indexW'];
            chipset.indexH = data['indexH'];
            chipset.sizeX = data['sizeX'];
            chipset.sizeY = data['sizeY'];
            chipset.dirCount = data['dirCount'];
            chipset.frameCount = data['frameCount'];
            chipset.defaultFrameNo = data['defaultFrameNo'];
            chipset.hitTop = data['hitTop'];
            chipset.hitLeft = data['hitLeft'];
            chipset.hitWidth = data['hitWidth'];
            chipset.hitHeight = data['hitHeight'];
            mapCharacterChipsets[id] = chipset;
            ResourceManager.preloadImage(chipset.src);
        }

        public static unloadCharaChipsetData(id: number): void {
            if (mapCharacterChipsets[id]) {
                ResourceManager.unloadImage(mapCharacterChipsets[id].src);
                delete mapCharacterChipsets[id];
            }
        }

        public static getCharaChipsetData(id: number): MapCharacterChipset {
            return mapCharacterChipsets[id];
        }
    }
}
