/// <reference path='./DataManager.ts' />
/// <reference path='./Game_CharacterBase.ts' />

//==============================================================================
// ■ Game_Character
//------------------------------------------------------------------------------
// 　主に移動ルートなどの処理を追加したキャラクターのクラスです。Game_Player、
// Game_Follower、GameVehicle、Game_Event のスーパークラスとして使用されます。
//==============================================================================

module ebi {

    export module rpg {
        export class Game_Character extends Game_CharacterBase {
            //--------------------------------------------------------------------------
            // ● 定数
            //--------------------------------------------------------------------------
            public static ROUTE_END: number               = 0;             // 移動ルートの終端
            public static ROUTE_MOVE_DOWN: number         = 1;             // 下に移動
            public static ROUTE_MOVE_LEFT: number         = 2;             // 左に移動
            public static ROUTE_MOVE_RIGHT: number        = 3;             // 右に移動
            public static ROUTE_MOVE_UP: number           = 4;             // 上に移動
            public static ROUTE_MOVE_LOWER_L: number      = 5;             // 左下に移動
            public static ROUTE_MOVE_LOWER_R: number      = 6;             // 右下に移動
            public static ROUTE_MOVE_UPPER_L: number      = 7;             // 左上に移動
            public static ROUTE_MOVE_UPPER_R: number      = 8;             // 右上に移動
            public static ROUTE_MOVE_RANDOM: number       = 9;             // ランダムに移動
            public static ROUTE_MOVE_TOWARD: number       = 10;            // プレイヤーに近づく
            public static ROUTE_MOVE_AWAY: number         = 11;            // プレイヤーから遠ざかる
            public static ROUTE_MOVE_FORWARD: number      = 12;            // 一歩前進
            public static ROUTE_MOVE_BACKWARD: number     = 13;            // 一歩後退
            public static ROUTE_JUMP: number              = 14;            // ジャンプ
            public static ROUTE_WAIT: number              = 15;            // ウェイト
            public static ROUTE_TURN_DOWN: number         = 16;            // 下を向く
            public static ROUTE_TURN_LEFT: number         = 17;            // 左を向く
            public static ROUTE_TURN_RIGHT: number        = 18;            // 右を向く
            public static ROUTE_TURN_UP: number           = 19;            // 上を向く
            public static ROUTE_TURN_90D_R: number        = 20;            // 右に 90 度回転
            public static ROUTE_TURN_90D_L: number        = 21;            // 左に 90 度回転
            public static ROUTE_TURN_180D: number         = 22;            // 180 度回転
            public static ROUTE_TURN_90D_R_L: number      = 23;            // 右か左に 90 度回転
            public static ROUTE_TURN_RANDOM: number       = 24;            // ランダムに方向転換
            public static ROUTE_TURN_TOWARD: number       = 25;            // プレイヤーの方を向く
            public static ROUTE_TURN_AWAY: number         = 26;            // プレイヤーの逆を向く
            public static ROUTE_SWITCH_ON: number         = 27;            // スイッチ ON
            public static ROUTE_SWITCH_OFF: number        = 28;            // スイッチ OFF
            public static ROUTE_CHANGE_SPEED: number      = 29;            // 移動速度の変更
            public static ROUTE_CHANGE_FREQ: number       = 30;            // 移動頻度の変更
            public static ROUTE_WALK_ANIME_ON: number     = 31;            // 歩行アニメ ON
            public static ROUTE_WALK_ANIME_OFF: number    = 32;            // 歩行アニメ OFF
            public static ROUTE_STEP_ANIME_ON: number     = 33;            // 足踏みアニメ ON
            public static ROUTE_STEP_ANIME_OFF: number    = 34;            // 足踏みアニメ OFF
            public static ROUTE_DIR_FIX_ON: number        = 35;            // 向き固定 ON
            public static ROUTE_DIR_FIX_OFF: number       = 36;            // 向き固定 OFF
            public static ROUTE_THROUGH_ON: number        = 37;            // すり抜け ON
            public static ROUTE_THROUGH_OFF: number       = 38;            // すり抜け OFF
            public static ROUTE_TRANSPARENT_ON: number    = 39;            // 透明化 ON
            public static ROUTE_TRANSPARENT_OFF: number   = 40;            // 透明化 OFF
            public static ROUTE_CHANGE_GRAPHIC: number    = 41;            // グラフィック変更
            public static ROUTE_CHANGE_OPACITY: number    = 42;            // 不透明度の変更
            public static ROUTE_CHANGE_BLENDING: number   = 43;            // 合成方法の変更
            public static ROUTE_PLAY_SE: number           = 44;            // SE の演奏
            public static ROUTE_SCRIPT: number            = 45;            // スクリプト

            //--------------------------------------------------------------------------
            // # protected
            //--------------------------------------------------------------------------
            public originalMoveRoute_: any;          // 元の移動ルート
            public originalMoveRouteIndex_: number;    // 元の移動ルートの実行位置
            public moveRoute_: any;                  // 移動ルート
            public moveRouteIndex_: number;            // 移動ルートの実行位置
            public moveRouteForcing_ : bool;           // 移動ルート強制フラグ
            public waitCount_: number;                 // ウェイトカウント

            //--------------------------------------------------------------------------
            // ● 公開インスタンス変数
            //--------------------------------------------------------------------------
            public get moveRouteForcing(): bool {return this.moveRouteForcing_;}

            //--------------------------------------------------------------------------
            // ● 公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPublicMembers(): void {
                super.initPublicMembers();
                this.moveRouteForcing_ = false;
            }
            //--------------------------------------------------------------------------
            // ● 非公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPrivateMembers(): void {
                super.initPrivateMembers();
                this.moveRoute_ = null; 
                this.moveRouteIndex_ = 0;
                this.originalMoveRoute_ = null;
                this.originalMoveRouteIndex_ = 0;
                this.waitCount_ = 0;
            }
            //--------------------------------------------------------------------------
            // ● 移動ルートの記憶
            //--------------------------------------------------------------------------
            public memorizeMoveRoute(): void {
                this.originalMoveRoute_       = this.moveRoute_;
                this.originalMoveRouteIndex_  = this.moveRouteIndex_;
            }
            //--------------------------------------------------------------------------
            // ● 移動ルートの復帰
            //--------------------------------------------------------------------------
            public restoreMoveRoute(): void {
                this.moveRoute_          = this.originalMoveRoute_;
                this.moveRouteIndex_     = this.originalMoveRouteIndex_;
                this.originalMoveRoute_  = null;
            }
            //--------------------------------------------------------------------------
            // ● 移動ルートの強制
            //--------------------------------------------------------------------------
            public forceMoveRoute(moveRoute: any): void {
                if (!this.originalMoveRoute_) {
                    this.memorizeMoveRoute();
                }
                this.moveRoute_ = moveRoute;
                this.moveRouteIndex_ = 0;
                this.moveRouteForcing_ = true;
                this.prelockDirection_ = 0;
                this.waitCount_ = 0;
            }
            //--------------------------------------------------------------------------
            // ● 停止時の更新
            //--------------------------------------------------------------------------
            public updateStop(): void {
                super.updateStop();
                if (this.moveRouteForcing_) {
                    this.updateRoutineMove();
                }
            }
            //--------------------------------------------------------------------------
            // ● ルートに沿った移動の更新
            //--------------------------------------------------------------------------
            public updateRoutineMove(): void {
                if (this.waitCount_ > 0) {
                    this.waitCount_ -= 1;
                } else {
                    this.moveSucceed_ = true
                    var command: string = this.moveRoute_.list[this.moveRouteIndex_];
                    if (command) {
                        this.processMoveCommand(command);
                        this.advanceMoveRouteIndex();
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● 移動コマンドの処理
            //--------------------------------------------------------------------------
            public processMoveCommand(command: any): any {
                var params: any[] = command.parameters;
                switch (command.code) {
                    case Game_Character.ROUTE_END:               
                        this.processRouteEnd();
                    break;
                    case Game_Character.ROUTE_MOVE_DOWN:         
                        this.moveStraight(2);
                    break;
                    case Game_Character.ROUTE_MOVE_LEFT:         
                        this.moveStraight(4);
                    break;
                    case Game_Character.ROUTE_MOVE_RIGHT:        
                        this.moveStraight(6);
                    break;
                    case Game_Character.ROUTE_MOVE_UP:           
                        this.moveStraight(8);
                    break;
                    case Game_Character.ROUTE_MOVE_LOWER_L:      
                        this.moveDiagonal(4, 2);
                    break;
                    case Game_Character.ROUTE_MOVE_LOWER_R:      
                        this.moveDiagonal(6, 2);
                    break;
                    case Game_Character.ROUTE_MOVE_UPPER_L:      
                        this.moveDiagonal(4, 8);
                    break;
                    case Game_Character.ROUTE_MOVE_UPPER_R:      
                        this.moveDiagonal(6, 8);
                    break;
                    case Game_Character.ROUTE_MOVE_RANDOM:       
                        this.moveRandom();
                    break;
                    case Game_Character.ROUTE_MOVE_TOWARD:       
                        this.moveTowardPlayer();
                    break;
                    case Game_Character.ROUTE_MOVE_AWAY:         
                        this.moveAwayFromPlayer();
                    break;
                    case Game_Character.ROUTE_MOVE_FORWARD:      
                        this.moveForward();
                    break;
                    case Game_Character.ROUTE_MOVE_BACKWARD:     
                        this.moveBackward();
                    break;
                    case Game_Character.ROUTE_JUMP:              
                        this.jump(params[0], params[1]);
                    break;
                    case Game_Character.ROUTE_WAIT:              
                        this.waitCount_ = params[0] - 1;
                    break;
                    case Game_Character.ROUTE_TURN_DOWN:         
                        this.setDirection(2);
                    break;
                    case Game_Character.ROUTE_TURN_LEFT:         
                        this.setDirection(4);
                    break;
                    case Game_Character.ROUTE_TURN_RIGHT:        
                        this.setDirection(6);
                    break;
                    case Game_Character.ROUTE_TURN_UP:           
                        this.setDirection(8);
                    break;
                    case Game_Character.ROUTE_TURN_90D_R:        
                        this.turnRight90();
                    break;
                    case Game_Character.ROUTE_TURN_90D_L:        
                        this.turnLeft90();
                    break;
                    case Game_Character.ROUTE_TURN_180D:         
                        this.turn180();
                    break;
                    case Game_Character.ROUTE_TURN_90D_R_L:      
                        this.turnRightOrLeft90();
                    break;
                    case Game_Character.ROUTE_TURN_RANDOM:       
                        this.turnRandom();
                    break;
                    case Game_Character.ROUTE_TURN_TOWARD:       
                        this.turnTowardPlayer();
                    break;
                    case Game_Character.ROUTE_TURN_AWAY:         
                        this.turnAwayFromPlayer();
                    break;
                    case Game_Character.ROUTE_SWITCH_ON:         
                        DataManager.gameSwitches[params[0]] = true;
                    break;
                    case Game_Character.ROUTE_SWITCH_OFF:        
                        DataManager.gameSwitches[params[0]] = false;
                    break;
                    case Game_Character.ROUTE_CHANGE_SPEED:      
                        this.moveSpeed_ = params[0];
                    break;
                    case Game_Character.ROUTE_CHANGE_FREQ:       
                        this.moveFrequency_ = params[0];
                    break;
                    case Game_Character.ROUTE_WALK_ANIME_ON:     
                        this.walkAnime_ = true;
                    break;
                    case Game_Character.ROUTE_WALK_ANIME_OFF:    
                        this.walkAnime_ = false;
                    break;
                    case Game_Character.ROUTE_STEP_ANIME_ON:     
                        this.stepAnime_ = true;
                    break;
                    case Game_Character.ROUTE_STEP_ANIME_OFF:    
                        this.stepAnime_ = false;
                    break;
                    case Game_Character.ROUTE_DIR_FIX_ON:        
                        this.directionFix_ = true;
                    break;
                    case Game_Character.ROUTE_DIR_FIX_OFF:       
                        this.directionFix_ = false;
                    break;
                    case Game_Character.ROUTE_THROUGH_ON:        
                        this.through_ = true;
                    break;
                    case Game_Character.ROUTE_THROUGH_OFF:       
                        this.through_ = false;
                    break;
                    case Game_Character.ROUTE_TRANSPARENT_ON:    
                        this.transparent = true;
                    break;
                    case Game_Character.ROUTE_TRANSPARENT_OFF:   
                        this.transparent = false;
                    break;
                    case Game_Character.ROUTE_CHANGE_GRAPHIC:    
                        this.setGraphic(params[0], params[1]);
                    break;
                    case Game_Character.ROUTE_CHANGE_OPACITY:    
                        this.opacity_ = params[0];
                    case Game_Character.ROUTE_CHANGE_BLENDING:   
                        this.blendType_ = params[0];
                    break;
                    case Game_Character.ROUTE_PLAY_SE:           
                        params[0].play();
                    break;
                    case Game_Character.ROUTE_SCRIPT:            
                        //TODO
                    break;
                }
            }
            //--------------------------------------------------------------------------
            // ● X 方向の距離計算
            //--------------------------------------------------------------------------
            public distanceXFrom(x: number): number {
                var result: number = this.x_ - x;
                if (DataManager.gameMap.isLoopHorizontal && Math.abs(result) > DataManager.gameMap.width / 2) {
                    if (result < 0) {
                        result += DataManager.gameMap.width;
                    } else {
                        result -= DataManager.gameMap.width;
                    }
                }
                return result;
            }
            //--------------------------------------------------------------------------
            // ● Y 方向の距離計算
            //--------------------------------------------------------------------------
            public distanceYFrom(y: number): any {
                var result: number = this.y_ - y;
                if (DataManager.gameMap.isLoopVertical && Math.abs(result) > DataManager.gameMap.height / 2) {
                    if (result < 0) {
                        result += DataManager.gameMap.height;
                    } else {
                        result -= DataManager.gameMap.height;
                    }
                }
                return result;
            }
            //--------------------------------------------------------------------------
            // ● ランダムに移動
            //--------------------------------------------------------------------------
            public moveRandom(): void {
                var rand: number = Math.floor(4 * Math.random());
                this.moveStraight(2 + rand * 2, false);
            }
            //--------------------------------------------------------------------------
            // ● キャラクターに近づく
            //--------------------------------------------------------------------------
            public moveTowardCharacter(character: Game_Character): void {
                var sx: number = this.distanceXFrom(character.x);
                var sy: number = this.distanceYFrom(character.y);
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.moveStraight(sx > 0 ? 4 : 6);
                    if (!this.moveSucceed_ && sy != 0) {
                        this.moveStraight(sy > 0 ? 8 : 2);
                    }
                } else {
                    if (sy != 0) {
                        this.moveStraight(sy > 0 ? 8 : 2);
                        if (!this.moveSucceed_ && sx != 0) {
                            this.moveStraight(sx > 0 ? 4 : 6); 
                        }
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● キャラクターから遠ざかる
            //--------------------------------------------------------------------------
            public moveAwayFromCharacter(character: Game_Character): void {
                var sx: number = this.distanceXFrom(character.x);
                var sy: number = this.distanceYFrom(character.y);
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.moveStraight(sx > 0 ? 6 : 4);
                    if (!this.moveSucceed_ && sy != 0) {
                        this.moveStraight(sy > 0 ? 2 : 8);
                    }
                } else {
                    if (sy != 0) {
                        this.moveStraight(sy > 0 ? 2 : 8);
                        if (!this.moveSucceed_ && sx != 0) {
                            this.moveStraight(sx > 0 ? 6 : 4);
                        }
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● キャラクターの方を向く
            //--------------------------------------------------------------------------
            public turnTowardCharacter(character: Game_Character): void {
                var sx: number = this.distanceXFrom(character.x);
                var sy: number = this.distanceYFrom(character.y);
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.setDirection(sx > 0 ? 4 : 6);
                } else {
                    if (sy != 0) {
                        this.setDirection(sy > 0 ? 8 : 2);
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● キャラクターの逆を向く
            //--------------------------------------------------------------------------
            public turnAwayFromCharacter(character: Game_Character): void {
                var sx: number = this.distanceXFrom(character.x);
                var sy: number = this.distanceYFrom(character.y);
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.setDirection(sx > 0 ? 6 : 4);
                } else{ 
                    if (sy != 0) {
                        this.setDirection(sy > 0 ? 2 : 8);
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーの方を向く
            //--------------------------------------------------------------------------
            public turnTowardPlayer(): void {
                this.turnTowardCharacter(DataManager.gamePlayer);
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーの逆を向く
            //--------------------------------------------------------------------------
            public turnAwayFromPlayer(): void {
                this.turnAwayFromCharacter(DataManager.gamePlayer);
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーに近づく
            //--------------------------------------------------------------------------
            public moveTowardPlayer(): void {
                this.moveTowardCharacter(DataManager.gamePlayer);
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーから遠ざかる
            //--------------------------------------------------------------------------
            public moveAwayFromPlayer(): void {
                this.moveAwayFromCharacter(DataManager.gamePlayer);
            }
            //--------------------------------------------------------------------------
            // ● 一歩前進
            //--------------------------------------------------------------------------
            public moveForward(): void {
                this.moveStraight(this.direction_);
            }
            //--------------------------------------------------------------------------
            // ● 一歩後退
            //--------------------------------------------------------------------------
            public moveBackward(): void {
                var lastDirectionFix: bool = this.directionFix_;
                this.directionFix_ = true;
                this.moveStraight(this.reverseDir(this.direction_), false);
                this.directionFix_ = lastDirectionFix;
            }
            //--------------------------------------------------------------------------
            // ● ジャンプ
            //     xPlus : X 座標加算値
            //     yPlus : Y 座標加算値
            //--------------------------------------------------------------------------
            public jump(xPlus: number, yPlus: number): void {
                if (Math.abs(xPlus) > Math.abs(yPlus)) {
                    if (xPlus != 0) {
                        this.setDirection(xPlus < 0 ? 4 : 6);
                    }
                } else {
                    if (yPlus != 0) {
                        this.setDirection(yPlus < 0 ? 8 : 2);
                    }
                }
                this.x_ += xPlus;
                this.y_ += yPlus;
                var distance: number = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
                this.jumpPeak_ = 10 + distance - this.moveSpeed_;  
                this.jumpCount_ = this.jumpPeak_ * 2;
                this.stopCount_ = 0;
                this.straighten();
            }
            //--------------------------------------------------------------------------
            // ● 移動ルート終端の処理
            //--------------------------------------------------------------------------
            public processRouteEnd(): void {
                if (this.moveRoute_.repeat) {
                    this.moveRouteIndex_ = -1;
                } else {
                    if (this.moveRouteForcing_) {
                        this.moveRouteForcing_ = false;
                        this.restoreMoveRoute();
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● 移動ルートの実行位置を進める
            //--------------------------------------------------------------------------
            public advanceMoveRouteIndex(): any {
                if (this.moveSucceed_ || this.moveRoute_.skippable) {
                  this.moveRouteIndex_ += 1;
                }
            }
            //--------------------------------------------------------------------------
            // ● 右に 90 度回転
            //--------------------------------------------------------------------------
            public turnRight90(): void {
                switch (this.direction_) {       
                    case 2:  
                        this.setDirection(4);
                    break;
                    case 4:  
                        this.setDirection(8);
                    break;
                    case 6:  
                        this.setDirection(2);
                    break;
                    case 8:  
                        this.setDirection(6);
                    break;
                }
            }
            //--------------------------------------------------------------------------
            // ● 左に 90 度回転
            //--------------------------------------------------------------------------
            public turnLeft90(): void {
                switch (this.direction_) {      
                    case 2:  
                        this.setDirection(6);
                    break;
                    case 4:  
                        this.setDirection(2);
                    break;
                    case 6:  
                        this.setDirection(8);
                    break;
                    case 8:  
                        this.setDirection(4);
                    break;
                }
            }
            //--------------------------------------------------------------------------
            // ● 180 度回転
            //--------------------------------------------------------------------------
            public turn180(): void {
                this.setDirection(this.reverseDir(this.direction_));
            }
            //--------------------------------------------------------------------------
            // ● 右か左に 90 度回転
            //--------------------------------------------------------------------------
            public turnRightOrLeft90(): any {
                var rand: number = Math.floor((Math.random() * 2));
                switch (rand) {
                case 0:  
                    this.turnRight90();
                break;
                case 1:  
                    this.turnLeft90();
                break;
                }
            }
            //--------------------------------------------------------------------------
            // ● ランダムに方向転換
            //--------------------------------------------------------------------------
            public turnRandom(): any {
                var rand: number = Math.floor(Math.random() * 4);
                this.setDirection(2 + rand * 2);
            }
            //--------------------------------------------------------------------------
            // ● キャラクターの位置を交換
            //--------------------------------------------------------------------------
            public swap(character: Game_Character): void {
                var newX: number = character.x;
                var newY: number = character.y;
                character.moveto(this.x, this.y);
                this.moveto(newX, newY);
            }
        }
    }
}
