/// <reference path='../../underscore.d.ts' />
/// <reference path='./DataManager.ts' />

//==============================================================================
// ■ Game_CharacterBase
//------------------------------------------------------------------------------
// 　キャラクターを扱う基本のクラスです。全てのキャラクターに共通する、座標やグ
// ラフィックなどの基本的な情報を保持します。
//==============================================================================

module ebi {

    export module rpg {
        class Game_CharacterBase {
            //--------------------------------------------------------------------------
            // ● Private変数
            //--------------------------------------------------------------------------

            // Priate
            private originalDirection_: number;      // 元の向き
            private originalPattern_: number;        // 元のパターン
            private animeCount_: number;             // アニメカウント
            private stopCount_: number;              // 停止カウント
            private jumpCount_: number;              // ジャンプカウント
            private jumpPeak_: number;               // ジャンプの頂点のカウント
            private locked_: bool;                   // ロックフラグ
            private prelockDirection_: number;       // ロック前の向き
            private moveSucceed_: bool;              // 移動成功フラグ

            // Readonly
            private id_: number;                     // ID
            private x_: number;                      // マップ X 座標（論理座標）
            private y_: number;                      // マップ Y 座標（論理座標）
            private realX_: number;                  // マップ X 座標（実座標）
            private realY_: number;                  // マップ Y 座標（実座標）
            private tileId_: number;                 // タイル ID（0 なら無効）
            private characterName_: string;          // 歩行グラフィック ファイル名
            private characterIndex_: number;         // 歩行グラフィック インデックス
            private moveSpeed_: number;              // 移動速度
            private moveFrequency_: number;          // 移動頻度
            private walkAnime_: bool;                // 歩行アニメ
            private stepAnime_: bool;                // 足踏みアニメ
            private directionFix_: bool;             // 向き固定
            private opacity_: number;                // 不透明度
            private blendType_: number;              // 合成方法
            private direction_: number;              // 向き
            private pattern_: number;                // パターン
            private priorityType_: number;           // プライオリティタイプ
            private through_: bool;                  // すり抜け
            private bushDepth_: number;                // 茂み深さ

            //--------------------------------------------------------------------------
            // ● 公開インスタンス変数
            //--------------------------------------------------------------------------

            // ReadOnly
            public get id(): number {return this.id_;}
            public get x(): number {return this.x_;}
            public get y(): number {return this.y_;}
            public get realX(): number {return this.realX_;}                 
            public get realY(): number {return this.realY_;} 
            public get tileId(): number {return this.tileId_;} 
            public get characterName(): string {return this.characterName_;}
            public get characterIndex(): number {return this.characterIndex_;}
            public get moveSpeed(): number {return this.moveSpeed_;}
            public get moveFrequency(): number {return this.moveFrequency_;}
            public get walkAnime(): bool {return this.walkAnime_;}
            public get stepAnime(): bool {return this.stepAnime_;}
            public get directionFix(): bool {return this.directionFix_;}
            public get opacity(): number {return this.opacity_;}
            public get blendType(): number {return this.blendType_;}
            public get direction(): number {return this.direction_;}
            public get pattern(): number {return this.pattern_;}
            public get priorityType(): number {return this.priorityType_;}
            public get through(): bool {return this.through_;}
            public get bushDepth(): number {return this.bushDepth_;}

            // Read & Write
            public animationId: number;
            public balloonId: number;
            public transparent: bool;

            //--------------------------------------------------------------------------
            // ● オブジェクト初期化
            //--------------------------------------------------------------------------
            constructor() {
                this.initPublicMembers();
                this.initPrivateMembers();
            }

            //--------------------------------------------------------------------------
            // ● 公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            private initPublicMembers() {
                this.id_ = 0;
                this.x_ = 0;
                this.y_ = 0;
                this.realX_ = 0;
                this.realY_ = 0;
                this.tileId_ = 0;
                this.characterName_ = "";
                this.characterIndex_ = 0;
                this.moveSpeed_ = 4;
                this.moveFrequency_ = 6;
                this.walkAnime_ = true;
                this.stepAnime_ = false;
                this.directionFix_ = false;
                this.opacity_ = 255;
                this.blendType_ = 0;
                this.direction_ = 2;
                this.pattern_ = 1;
                this.priorityType_ = 1;
                this.through_ = false;
                this.bushDepth_ = 0;
                this.animationId = 0;
                this.balloonId = 0;
                this.transparent = false;
            }
            //--------------------------------------------------------------------------
            // ● 非公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            private initPrivateMembers() {
                this.originalDirection_ = 2;
                this.originalPattern_ = 1;
                this.animeCount_ = 0;
                this.stopCount_ = 0;
                this.jumpCount_ = 0;
                this.jumpPeak_ = 0;
                this.locked_ = false;
                this.prelockDirection_ = 0;
                this.moveSucceed_ = true;
            }
            //--------------------------------------------------------------------------
            // ● 座標一致判定
            //--------------------------------------------------------------------------
            public equalPos(x: number, y: number): bool {
                return this.x_ == x && this.y_ == y;
            }
            //--------------------------------------------------------------------------
            // ● 座標一致と「すり抜け OFF」判定（nt = No Through）
            //--------------------------------------------------------------------------
            public equalPosNT(x: number, y: number): bool {
                return this.equalPos(x, y) && !this.through_;
            }
            //--------------------------------------------------------------------------
            // ● プライオリティ［通常キャラと同じ］判定
            //--------------------------------------------------------------------------
            public isNormalPriority(): bool {
                return this.priorityType_ == 1;
            }
            //--------------------------------------------------------------------------
            // ● 移動中判定
            //--------------------------------------------------------------------------
            public isMoving(): bool {
                return this.realX_ != this.x_ || this.realY_ != this.y_;
            }
            //--------------------------------------------------------------------------
            // ● ジャンプ中判定
            //--------------------------------------------------------------------------
            public isJumping(): bool {
                return this.jumpCount_ > 0;
            }
            //--------------------------------------------------------------------------
            // ● ジャンプの高さを計算
            //--------------------------------------------------------------------------
            public jumpHeight(): number {
                return (this.jumpPeak_ * this.jumpPeak_ - Math.pow(Math.abs(this.jumpCount_ - this.jumpPeak_), 2)) / 2;
            }
            //--------------------------------------------------------------------------
            // ● 停止中判定
            //--------------------------------------------------------------------------
            public isStopping(): bool {
                return !this.isMoving() && !this.isJumping();
            }
            //--------------------------------------------------------------------------
            // ● 移動速度の取得（ダッシュを考慮）
            //--------------------------------------------------------------------------
            private realMoveSpeed(): number {
                return this.moveSpeed + (this.isDash() ? 1 : 0);
            }
            //--------------------------------------------------------------------------
            // ● 1 フレームあたりの移動距離を計算
            //--------------------------------------------------------------------------
            private distancePerFrame(): number {
                return Math.pow(2, this.realMoveSpeed()) / 256.0;
            }
            //--------------------------------------------------------------------------
            // ● ダッシュ状態判定
            //--------------------------------------------------------------------------
            public isDash(): bool {
                return false;
            }
            //--------------------------------------------------------------------------
            // ● デバッグすり抜け状態判定
            //--------------------------------------------------------------------------
            public isDebugThrough(): bool {
                return false;
            }
            //--------------------------------------------------------------------------
            // ● 姿勢の矯正
            //--------------------------------------------------------------------------
            public straighten(): void {
                if (this.walkAnime_ || this.stepAnime_) {
                    this.pattern_ = 1;
                    this.animeCount_ = 0;
                }
            }
            //--------------------------------------------------------------------------
            // ● 逆方向の取得
            //     d : 方向（2,4,6,8）
            //--------------------------------------------------------------------------
            public reverseDir(d): number {
                return 10 - d;
            }
            //--------------------------------------------------------------------------
            // ● 通行可能判定
            //     d : 方向（2,4,6,8）
            //--------------------------------------------------------------------------
            public isPassable(x: number, y: number, d: number): bool {
                // TODO: get global variable somehow
                var x2: number = DataManager.gameMap.roundXWithDirection(x, d)
                var y2: number = DataManager.gameMap.roundYWithDirection(y, d)
                if (!DataManager.gameMap.isValid(x2, y2)) {
                    return false;
                }
                if (this.through_ || this.isDebugThrough()) {
                    return true;
                }
                if (!this.isMapPassable(x, y, d)) {
                    return false;
                }
                if (!this.isMapPassable(x2, y2, this.reverseDir(d))) {
                    return false;
                }
                if (this.collideWithCharacters(x2, y2)) {
                    return false;
                }
                return true
            }
            //--------------------------------------------------------------------------
            // ● 斜めの通行可能判定
            //     horz : 横方向（4 or 6）
            //     vert : 縦方向（2 or 8）
            //--------------------------------------------------------------------------
            public isDiagonalPassable(x: number, y: number, horz: number, vert: number): bool {
                var x2: number = DataManager.gameMap.roundXWithDirection(x, horz);
                var y2: number = DataManager.gameMap.roundYWithDirection(y, vert);
                return (this.isPassable(x, y, vert) && this.isPassable(x, y2, horz)) ||
                    (this.isPassable(x, y, horz) && this.isPassable(x2, y, vert));
            }
            //--------------------------------------------------------------------------
            // ● マップ通行可能判定
            //     d : 方向（2,4,6,8）
            //--------------------------------------------------------------------------
            public isMapPassable(x: number, y: number, d: number): bool {
                return DataManager.gameMap.isPassable(x, y, d);
            }
            //--------------------------------------------------------------------------
            // ● キャラクターとの衝突判定
            //--------------------------------------------------------------------------
            public collideWithCharacters(x: number, y: number): bool {
                return this.collideWithEvents(x, y);
            }
            //--------------------------------------------------------------------------
            // ● イベントとの衝突判定
            //--------------------------------------------------------------------------
            public collideWithEvents(x: number, y: number): bool {
                return _.any(
                    DataManager.gameMap.eventsXYNT(x, y), 
                    (event) => event.normalPriority() // TODO || (typeof this === Game_Event)
                )
            }
            //--------------------------------------------------------------------------
            // ● 指定位置に移動
            //--------------------------------------------------------------------------
            public moveto(x, y) {
                this.x_ = x % DataManager.gameMap.width;
                this.y_ = y % DataManager.gameMap.height;
                this.realX_ = this.x_;
                this.realY_ = this.y_;
                this.prelockDirection_ = 0;
                this.straighten();
                this.updateBushDepth();
            }
            //--------------------------------------------------------------------------
            // ● 指定方向に向き変更
            //     d : 方向（2,4,6,8）
            //--------------------------------------------------------------------------
            public setDirection(d: number) {
                if (!this.directionFix_ && d != 0) {
                    this.direction_ = d;
                }
                this.stopCount_ = 0;
            }
            //--------------------------------------------------------------------------
            // ● タイル判定
            //--------------------------------------------------------------------------
            public isTile(): bool {
                return this.tileId_ > 0 && this.priorityType_ == 0;
            }
            //--------------------------------------------------------------------------
            // ● オブジェクトキャラクター判定
            //--------------------------------------------------------------------------
            public isObjectCharacter(): bool {
                return this.tileId > 0 || this.characterName[0, 1] == '!';
            }
            //--------------------------------------------------------------------------
            // ● タイルの位置から上にずらすピクセル数を取得
            //--------------------------------------------------------------------------
            public shiftY(): number {
                return this.isObjectCharacter() ? 0 : 4;
            }
            //--------------------------------------------------------------------------
            // ● 画面 X 座標の取得
            //--------------------------------------------------------------------------
            public screenX(): number {
                return DataManager.gameMap.adjustX(this.realX_) * 32 + 16;
            }
            //--------------------------------------------------------------------------
            // ● 画面 Y 座標の取得
            //--------------------------------------------------------------------------
            public screenY(): number {
                return DataManager.gameMap.adjustY(this.realY_) * 32 + 32 - this.shiftY() - this.jumpHeight();
            }
            //--------------------------------------------------------------------------
            // ● 画面 Z 座標の取得
            //--------------------------------------------------------------------------
            public screenZ(): number {
                return this.priorityType * 100;
            }
            //--------------------------------------------------------------------------
            // ● フレーム更新
            //--------------------------------------------------------------------------
            public update(): void {
                this.updateAnimation();
                if (this.isJumping()) {return this.updateJump();}
                if (this.isMoving()) {return this.updateMove();}
                return this.updateStop();
            }
            //--------------------------------------------------------------------------
            // ● ジャンプ時の更新
            //--------------------------------------------------------------------------
            private updateJump(): void {
                this.jumpCount_ -= 1;
                this.realX_ = (this.realX_ * this.jumpCount_ + this.x_) / (this.jumpCount_ + 1.0);
                this.realY_ = (this.realY_ * this.jumpCount_ + this.y_) / (this.jumpCount_ + 1.0);
                this.updateBushDepth();
                if (this.jumpCount_ == 0) {
                    this.realX_ = this.x_ = DataManager.gameMap.round_x(this.x_);
                    this.realY_ = this.y_ = DataManager.gameMap.round_y(this.y_);
                }
            }
            //--------------------------------------------------------------------------
            // ● 移動時の更新
            //--------------------------------------------------------------------------
            private updateMove(): void {
                if (this.x_ < this.realX_) {
                    this.realX_ = Math.max(this.realX_ - this.distancePerFrame(), this.x_);
                }
                if (this.x_ > this.realX_) {
                    this.realX_ = Math.min(this.realX_ + this.distancePerFrame(), this.x_);
                }
                if (this.y_ < this.realY_) {
                    this.realY_ = Math.max(this.realY_ - this.distancePerFrame(), this.y_);
                }
                if (this.y_ > this.realY_) {
                    this.realY_ = Math.min(this.realY_ + this.distancePerFrame(), this.y_);
                }
                if (!this.isMoving()) {
                    this.updateBushDepth();
                }
            }
            //--------------------------------------------------------------------------
            // ● 停止時の更新
            //--------------------------------------------------------------------------
            private updateStop(): void {
                if (this.locked_) {
                    this.stopCount_ += 1;
                }
            }
            //--------------------------------------------------------------------------
            // ● 歩行／足踏みアニメの更新
            //--------------------------------------------------------------------------
            private updateAnimation(): void {
                this.updateAnimeCount();
                if (this.animeCount_ > 18 - this.realMoveSpeed() * 2) {
                    this.updateAnimePattern();
                    this.animeCount_ = 0;
                }
            }
            //--------------------------------------------------------------------------
            // ● アニメカウントの更新
            //--------------------------------------------------------------------------
            private updateAnimeCount(): void {
                if (this.isMoving() && this.walkAnime_) {
                    this.animeCount_ += 1.5;
                } else { 
                    if(this.stepAnime_ || this.pattern_ != this.originalPattern_) {
                        this.animeCount_ += 1;
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● アニメパターンの更新
            //--------------------------------------------------------------------------
            private updateAnimePattern(): void {
                if (!this.stepAnime_ && this.stopCount_ > 0) {
                    this.pattern_ = this.originalPattern_;
                } else {
                    this.pattern_ = (this.pattern_ + 1) % 4;
                }
            }
            //--------------------------------------------------------------------------
            // ● 梯子判定
            //--------------------------------------------------------------------------
            private get isLadder(): bool {
                return DataManager.gameMap.isLadder(this.x_, this.y_);
            }
            //--------------------------------------------------------------------------
            // ● 茂み深さの更新
            //--------------------------------------------------------------------------
            private updateBushDepth(): void {
                if (this.isNormalPriority() && !this.isObjectCharacter() && this.isBush && !this.isJumping()) {
                    if (!this.isMoving()) {
                        this.bushDepth_ = 8;
                    }
                } else {
                    this.bushDepth_ = 0;
                }
            }
            //--------------------------------------------------------------------------
            // ● 茂み判定
            //--------------------------------------------------------------------------
            public get isBush(): bool {
                return DataManager.gameMap.isBush(this.x_, this.y_);
            }
            //--------------------------------------------------------------------------
            // ● 地形タグの取得
            //--------------------------------------------------------------------------
            public terrainTag(): bool {
                return DataManager.gameMap.terrainTag(this.x_, this.y_);
            }
            //--------------------------------------------------------------------------
            // ● リージョン ID の取得
            //--------------------------------------------------------------------------
            public regionId(): number {
                return DataManager.gameMap.regionId(this.x_, this.y_);
            }
            //--------------------------------------------------------------------------
            // ● 歩数増加
            //--------------------------------------------------------------------------
            public increaseSteps(): void {
                if (this.isLadder) {
                    this.setDirection(8);
                }
                this.stopCount_ = 0;
                this.updateBushDepth();
            }
            //--------------------------------------------------------------------------
            // ● グラフィックの変更
            //     character_name  : 新しい歩行グラフィック ファイル名
            //     character_index : 新しい歩行グラフィック インデックス
            //--------------------------------------------------------------------------
            public setGraphic(characterName: string, characterIndex: number): void {
                this.tileId_ = 0;
                this.characterName_ = characterName;
                this.characterIndex_ = characterIndex;
                this.originalPattern_ = 1;
            }
            //--------------------------------------------------------------------------
            // ● 正面の接触イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerTouchFront(): bool {
                var x2: number = DataManager.gameMap.roundXWithDirection(this.x_, this.direction_);
                var y2: number = DataManager.gameMap.roundYWithDirection(this.y_, this.direction_);
                return this.checkEventTriggerTouch(x2, y2);
            }
            //--------------------------------------------------------------------------
            // ● 接触イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerTouch(x: number, y: number): bool {
                return false
            }
            //--------------------------------------------------------------------------
            // ● まっすぐに移動
            //     d      方向（2,4,6,8）
            //     turn_ok : その場での向き変更を許可
            //--------------------------------------------------------------------------
            public moveStraight(d: number, turnOk: bool = true): bool {
                this.moveSucceed_ = this.isPassable(this.x_, this.y_, d);
                if (this.moveSucceed_) {
                    this.setDirection(d);
                    this.x_ = DataManager.gameMap.roundXWithDirection(this.x_, d);
                    this.y_ = DataManager.gameMap.roundYWithDirection(this.y_, d);
                    this.realX_ = DataManager.gameMap.XWithDirection(this.x_, this.reverseDir(d));
                    this.realY_ = DataManager.gameMap.YWithDirection(this.y_, this.reverseDir(d));
                    this.increaseSteps();
                } else {
                    if (turnOk) {
                        this.setDirection(d);
                        return this.checkEventTriggerTouchFront();
                    }
                }
            }
            //--------------------------------------------------------------------------
            // ● 斜めに移動
            //     horz : 横方向（4 or 6）
            //     vert : 縦方向（2 or 8）
            //--------------------------------------------------------------------------
            public moveDiagonal(horz: number, vert: number): void {
                this.moveSucceed_ = this.isDiagonalPassable(this.x, this.y, horz, vert);
                if (this.moveSucceed_) {
                    this.x_ = DataManager.gameMap.roundXWithDirection(this.x_, horz);
                    this.y_ = DataManager.gameMap.roundYWithDirection(this.y_, vert);
                    this.realX_ = DataManager.gameMap.XWithDirection(this.x_, this.reverseDir(horz));
                    this.realY_ = DataManager.gameMap.YWithDirection(this.y_, this.reverseDir(vert));
                    this.increaseSteps();
                }

                if (this.direction_ == this.reverseDir(horz)) {
                    this.setDirection(horz);
                }

                if (this.direction_ == this.reverseDir(vert)) {
                    this.setDirection(vert);
                }
            }
        }
    }
}