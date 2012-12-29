module ebi.rpg {
    export class DatabaseManager {
        public static mapCharacterChipsetData = {
            "1": {
                "src_image": "characters/chara01.png",
                "src_x": 0,
                "src_y": 0,
                "src_width": 32,
                "src_height": 32,
                "dir_count": 4,
                "anim_count": 3
            }
        };

        public static getCharaChipsetData(id: number): any {
            return mapCharacterChipsetData[id.toString()];
        }
    }
}
