/// <reference path='./DataManager.ts' />

//==============================================================================
// ■ Game_CommonEvent;
//------------------------------------------------------------------------------
// 　コモンイベントを扱うクラスです。並列処理イベントを実行する機能を持っていま
// す。このクラスは Game_Map クラス（DataManager.gameMap）の内部で使用されます。
//==============================================================================

module ebi {
    export module rpg {
        export class Game_CommonEvent {
            //--------------------------------------------------------------------------
            // # Private
            //--------------------------------------------------------------------------
            private interpreter_: any;
            private event_: any;

            //--------------------------------------------------------------------------
            // ● オブジェクト初期化
            //--------------------------------------------------------------------------
            constructor(commonEventId: number) {
                this.event_ = DataManager.dataCommonEvents[commonEventId];
                this.refresh();
            }

            //--------------------------------------------------------------------------
            // ● リフレッシュ
            //--------------------------------------------------------------------------
            public refresh(): void {
                if (this.isActive()) {
                    //TODO this.interpreter_ ||= new Game_Interpreter()
                } else {
                    this.interpreter_ = null;
                }

            }

            //--------------------------------------------------------------------------
            // ● 有効状態判定
            //--------------------------------------------------------------------------
            public isActive(): bool {
                return this.event_.isParallel() && DataManager.gameSwitches[this.event_.switchId];
            }

            //--------------------------------------------------------------------------
            // ● フレーム更新
            //--------------------------------------------------------------------------
            public update(): void {
                if (this.interpreter_) {
                    if (!this.interpreter_.isRunning()) {
                        this.interpreter_.setup(this.event_.list);
                    }
                    this.interpreter_.update();
                }
            }
         }
    }
}
