/// <reference path='../../underscore.d.ts' />
/// <reference path='../Game/ebi.ts' />
/// <reference path='./DataManager.ts' />
/// <reference path='./Game_Character.ts' />

//==============================================================================
// ■ Game_Event
//------------------------------------------------------------------------------
// 　イベントを扱うクラスです。条件判定によるイベントページ切り替えや、並列処理
// イベント実行などの機能を持っており、Game_Map クラスの内部で使用されます。
//==============================================================================

module ebi {

    export module rpg {
        export class Game_Event extends Game_Character {
            //--------------------------------------------------------------------------
            // ● private変数
            //--------------------------------------------------------------------------
            private mapId_: number;
            private event_: any;
            private page_: any;
            private interpreter_: any;              
            private erased_: bool;                  // 一時消去フラグ

            // Event Paramater
            private characterName_: string;
            private characterIndex: number;
            private moveType_: number;              // 移動タイプ
            

            private trigger_: number;                // トリガー
            private list_: any[];                    // 実行内容
            private starting_: bool;                 // 起動中フラグ

            //--------------------------------------------------------------------------
            // ● 公開インスタンス変数
            //--------------------------------------------------------------------------
            public get trigger(): number { return this.trigger; }
            public get list(): any[] { return this.list; }
            public get starting(): bool { return this.starting_; }

            //--------------------------------------------------------------------------
            // ● オブジェクト初期化
            //     event : rpg::event
            //--------------------------------------------------------------------------
            constructor(mapId: number, event: any) {
                super();
                this.mapId_ = mapId;
                this.event_ = event;
                this.id_ = this.event_.id;
                this.moveto(this.event_.x, this.event_.y);
                this.refresh();
            }
            //--------------------------------------------------------------------------
            // ● 公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPublicMembers(): void {
                super.initPublicMembers();
                this.trigger_ = 0;
                this.list_ = null;
                this.starting_ = false;
            }
            //--------------------------------------------------------------------------
            // ● 非公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPrivateMembers(): void {
                super.initPrivateMembers();
                this.moveType_ = 0;                        
                this.erased_ = false;                       
                this.page_ = null;                          // イベントページ
            }
            //--------------------------------------------------------------------------
            // ● キャラクターとの衝突判定
            //--------------------------------------------------------------------------
            public collideWithCharacters(x: number, y: number): bool {
                return super.collideWithCharacters(x, y) || this.collideWithPlayerCharacters(x, y);
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーとの衝突判定（フォロワーを含む）
            //--------------------------------------------------------------------------
            public collideWithPlayerCharacters(x: number, y: number): bool {
                return this.isNormalPriority() && DataManager.gamePlayer.collide(x, y);
            }
            //--------------------------------------------------------------------------
            // ● ロック（実行中のイベントが立ち止まる処理）
            //--------------------------------------------------------------------------
            public lock(): void {
                if (!this.locked_) {
                  this.prelockDirection_ = this.direction_;
                  this.turnTowardPlayer();
                  this.locked_ = true;
                }
            }
            //--------------------------------------------------------------------------
            // ● ロック解除
            //--------------------------------------------------------------------------
            public unlock(): void {
                if (this.locked_) {
                    this.locked_ = false;
                    this.setDirection(this.prelockDirection_);
                }
            }
            //--------------------------------------------------------------------------
            // ● 停止時の更新
            //--------------------------------------------------------------------------
            public updateStop(): void {
                super.updateStop();
                if (!this.moveRouteForcing_) {
                    this.updateSelfMovement();
                }
            }
            //--------------------------------------------------------------------------
            // ● 自律移動の更新
            //--------------------------------------------------------------------------
            public updateSelfMovement(): void {
                if (this.isNearTheScreen() && this.stopCount_ > this.stopCountThreshold) {
                    switch(this.moveType_) {
                    case 1:
                        this.moveTypeRandom();
                    break;
                    case 2:
                        this.moveTypeTowardPlayer();
                    break;
                    case 3:
                        this.moveTypeCustom();
                    break;
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● 画面の可視領域付近にいるか判定
            //     dx : 画面中央から左右何マス以内を判定するか
            //     dy : 画面中央から上下何マス以内を判定するか
            //--------------------------------------------------------------------------
            public isNearTheScreen(dx: number = 12, dy: number = 8): bool {
                var ax: number = DataManager.gameMap.adjustX(this.realX_) - game.Graphics.width / 2 / 32
                var ay: number = DataManager.gameMap.adjustY(this.realY_) - game.Graphics.height / 2 / 32
                return ax >= -dx && ax <= dx && ay >= -dy && ay <= dy;
            }
            //--------------------------------------------------------------------------
            // ● 自律移動を開始する停止カウントの閾値を計算
            //--------------------------------------------------------------------------
            public get stopCountThreshold(): number {
                return 30 * (5 - this.moveFrequency_);
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : ランダム
            //--------------------------------------------------------------------------
            public moveTypeRandom(): void {
                var rand:number = Math.round(Math.random() * 6);
                switch(rand) {
                    case 0: // Go through
                    case 1: 
                        this.moveRandom(); 
                    break;
                    case 2: // Go through
                    case 3: // Go through
                    case 4: 
                        this.moveForward(); 
                    break;
                    case 5:
                        this.stopCount_ = 0;
                    break;
                }
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : 近づく
            //--------------------------------------------------------------------------
            public moveTypeTowardPlayer(): void {
                if (this.isNearThePlayer) {
                    var rand:number = Math.round(Math.random() * 6);
                    switch(rand) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            this.moveTowardPlayer();
                        case 4:     
                            this.moveRandom();
                        case 5:
                            this.moveForward();
                        break;
                    }
                } else {
                    this.moveRandom();
                }
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーの近くにいるか判定
            //--------------------------------------------------------------------------
            public get isNearThePlayer(): bool {
                var sx: number = Math.abs(this.distanceXFrom(DataManager.gamePlayer.x));
                var sy: number = Math.abs(this.distanceYFrom(DataManager.gamePlayer.y));
                return sx + sy < 20;
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : カスタム
            //--------------------------------------------------------------------------
            public moveTypeCustom(): void {
                this.updateRoutineMove();
            }
            //--------------------------------------------------------------------------
            // ● 起動中フラグのクリア
            //--------------------------------------------------------------------------
            public clearStartingFlag(): void {
                this.starting_ = false;
            }
            //--------------------------------------------------------------------------
            // ● 実行内容が空か否かを判定
            //--------------------------------------------------------------------------
            public get isEmpty(): bool {
                return !this.list_ || this.list_.length <= 1;
            }
            //--------------------------------------------------------------------------
            // ● 指定されたトリガーのいずれかか否かを判定
            //     triggers : トリガーの配列
            //--------------------------------------------------------------------------
            public isTriggerIn(triggers: number[]): bool {
                return _.contains(triggers, this.trigger_);
            }
            //--------------------------------------------------------------------------
            // ● イベント起動
            //--------------------------------------------------------------------------
            public start(): void {
                if (this.isEmpty) {
                    return;
                }
                
                this.starting_ = true
                if (this.isTriggerIn([0,1,2])) {
                    this.lock();
                }
            }
            //--------------------------------------------------------------------------
            // ● 一時消去
            //--------------------------------------------------------------------------
            public erase(): void {
                this.erased_ = true;
                this.refresh();
            }
            //--------------------------------------------------------------------------
            // ● リフレッシュ
            //--------------------------------------------------------------------------
            public refresh(): void {
                var newPage: any = this.erased_ ? null : this.findProperPage();

                if (!newPage || newPage != this.page_) {
                    this.setupPage(newPage);
                }
            }
            //--------------------------------------------------------------------------
            // ● 条件に合うイベントページを見つける
            //--------------------------------------------------------------------------
            public findProperPage(): any {
                return _.find(this.event_.pages.reverse(), (page: any) => {
                    this.conditionsMet(page);
                });
            }
            //--------------------------------------------------------------------------
            // ● イベントページの条件合致判定
            //--------------------------------------------------------------------------
            public conditionsMet(page): bool {
                var c: any = page.condition;
                if (c.switch1Valid) {
                    if(!DataManager.gameSwitches[c.switch1Id]) {
                        return false;
                    }
                }
                if (c.switch2Valid) {
                    if(!DataManager.gameSwitches[c.switch2Id]) {
                        return false;
                    }
                }
                if (c.variableValid) {
                    if(!DataManager.gameVariables[c.variableId] < c.variableValue) {
                        return false;
                    }
                }
                if (c.selfSwitchValid) {
                    var key: any = [this.mapId_, this.event_.id, c.selfSwitchCh];
                    if (DataManager.gameSelfSwitches[key] != true) {
                        return false;
                    }
                }

                /*
                if (c.itemValid) {
                  item = $dataItems[c.itemId]
                  return false unless $Game_Party.hasItem?(item)
                }
                if (c.actorValid) {
                  actor = $Game_Actors[c.actorId]
                  return false unless $Game_Party.members.include?(actor)
                }
                */
                return true;
            }
            //--------------------------------------------------------------------------
            // ● イベントページのセットアップ
            //--------------------------------------------------------------------------
            public setupPage(newPage: any): void {
                this.page_ = newPage;
                if (this.page_) {
                    this.setupPageSettings();
                } else {
                    this.clearPageSettings();
                }
                this.updateBushDepth();
                this.clearStartingFlag();
                this.checkEventTriggerAuto();
            }
            //--------------------------------------------------------------------------
            // ● イベントページの設定をクリア
            //--------------------------------------------------------------------------
            public clearPageSettings(): void {
                this.tileId_          = 0;
                this.characterName_   = "";
                this.characterIndex_  = 0;
                this.moveType_        = 0;
                this.through_         = true;
                this.trigger_         = null;
                this.list_            = null;
                this.interpreter_     = null;
            }
            //--------------------------------------------------------------------------
            // ● イベントページの設定をセットアップ
            //--------------------------------------------------------------------------
            public setupPageSettings(): void {
                this.tileId_          = this.page_.graphic.tileId;
                this.characterName_   = this.page_.graphic.characterName;
                this.characterIndex_  = this.page_.graphic.characterIndex;

                if (this.originalDirection_ != this.page_.graphic.direction) {
                    this.direction_          = this.page_.graphic.direction;
                    this.originalDirection_  = this.direction_;
                    this.prelockDirection_   = 0;
                }

                if (this.originalPattern_ != this.page_.graphic.pattern) {
                    this.pattern_            = this.page_.graphic.pattern;
                    this.originalPattern_    = this.pattern_;
                }

                this.moveType_          = this.page_.moveType;
                this.moveSpeed_         = this.page_.moveSpeed;
                this.moveFrequency_     = this.page_.moveFrequency;
                this.moveRoute_         = this.page_.moveRoute;
                this.moveRouteIndex_    = 0;
                this.moveRouteForcing_  = false;
                this.walkAnime_         = this.page_.walkAnime;
                this.stepAnime_         = this.page_.stepAnime;
                this.directionFix_      = this.page_.directionFix;
                this.through_           = this.page_.through;
                this.priorityType_      = this.page_.priorityType;
                this.trigger_           = this.page_.trigger;
                this.list_              = this.page_.list;
                this.interpreter_       = null; // TODO this.trigger_ == 4 ? new Game_Interpreter() : null;
            }
            //--------------------------------------------------------------------------
            // ● 接触イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerTouch(x: number, y: number): void {
                
                if (DataManager.gameMap.interpreter.isRunning()) {
                    return;
                }

                if (this.trigger_ == 2 && DataManager.gamePlayer.isPos(x, y)) {
                    if (!this.isJumping() && this.isNormalPriority()) {
                        this.start();
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● 自動イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerAuto(): void {
                if (this.trigger_ == 3) {
                    this.start();
                }
            }
            //--------------------------------------------------------------------------
            // ● フレーム更新
            //--------------------------------------------------------------------------
            public update(): void {
                super.update();
                this.checkEventTriggerAuto();
                if (!this.interpreter_) {
                    return;
                }

                if (!this.interpreter_.isRunning()) {
                    this.interpreter_.setup(this.list_, this.event_.id);
                }
                this.interpreter_.update();
            }
        }
    }
}
