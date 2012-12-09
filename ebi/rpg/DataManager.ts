/// <reference path='./Game_CommonEvent.ts' />
/// <reference path='./Game_Map.ts' />

module ebi {
    export module rpg {

        /**
         * Game_Player
         *
         * The only one instance in GameScene
         *
         */
        export class DataManager {
            //--------------------------------------------------------------------------
            // Accessor
            //--------------------------------------------------------------------------
            public static get dataCommonEvents(): Game_CommonEvent[] {
                return null; // TODO
            }

            public static get gameSwitches(): any {
                return null; // TODO
            }

            public static get gameVariables(): any {
                return null; // TODO
            }

            public static get gameSelfSwitches(): any {
                return null; // TODO
            }

            public static get dataTilesets(): any {
                return null; // TODO
            }

            public static get gameMap(): Game_Map {
                return null; // TODO
            }

            public static get gamePlayer(): any {
                return null; // TODO
            }
            
            //--------------------------------------------------------------------------
            // ● モジュール初期化
            //--------------------------------------------------------------------------
            public static init(): void {
                //@last_savefile_index = 0
                loadDatabase();
                //create_game_objects
            }
            //--------------------------------------------------------------------------
            // ● データベースのロード
            //--------------------------------------------------------------------------
            public static loadDatabase(): void {
                //$data_actors        = load_data("Data/Actors.rvdata2")
                //$data_classes       = load_data("Data/Classes.rvdata2")
                //$data_skills        = load_data("Data/Skills.rvdata2")
                //$data_items         = load_data("Data/Items.rvdata2")
                //$data_weapons       = load_data("Data/Weapons.rvdata2")
                //$data_armors        = load_data("Data/Armors.rvdata2")
                //$data_enemies       = load_data("Data/Enemies.rvdata2")
                //$data_troops        = load_data("Data/Troops.rvdata2")
                //$data_states        = load_data("Data/States.rvdata2")
                //$data_animations    = load_data("Data/Animations.rvdata2")
                //$data_tilesets      = load_data("Data/Tilesets.rvdata2")
                //$data_common_events = load_data("Data/CommonEvents.rvdata2")
                //$data_system        = load_data("Data/System.rvdata2")
                //$data_mapinfos      = load_data("Data/MapInfos.rvdata2")
            }
        }

    }

}