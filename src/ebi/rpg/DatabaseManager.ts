module ebi.rpg {
    export class DatabaseManager {
        public static mapCharacterChipsetData = {
            "1": {
                "srcImage": "characters/chara01",
                "charaX": 0,
                "charaY": 0,
                "srcWidth": 32,
                "srcHeight": 48,
                "dirCount": 4,
                "animCount": 3,
                "startDir": 0,
                "startAnim": 0
            },
            "2": {
                "srcImage": "characters/chara01",
                "charaX": 1,
                "charaY": 0,
                "srcWidth": 32,
                "srcHeight": 48,
                "dirCount": 4,
                "animCount": 3,
                "startDir": 1,
                "startAnim": 1
            },
            "3": {
                "srcImage": "characters/chara01",
                "charaX": 1,
                "charaY": 1,
                "srcWidth": 32,
                "srcHeight": 48,
                "dirCount": 4,
                "animCount": 3,
                "startDir": 2,
                "startAnim": 2
            },     
        };

        public static getCharaChipsetData(id: number): any {
            return mapCharacterChipsetData[id.toString()];
        }
    }
}
