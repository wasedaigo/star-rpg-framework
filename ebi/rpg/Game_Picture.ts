/// <reference path='../game/ebi.ts' />

//==============================================================================
// ■ Game_Picture;
//------------------------------------------------------------------------------
// 　ピクチャを扱うクラスです。このクラスは Game_Pictures クラスの内部で、特定
// の番号のピクチャが必要になったときだけ作成されます。
//==============================================================================

module ebi {
    export module rpg {
        export class Game_Picture {
            //--------------------------------------------------------------------------
            // Private
            //--------------------------------------------------------------------------
            private rotateSpeed_: number;
            private duration_: number;
            private toneDuration_: number;
            private toneTarget_: game.Tone;
            private targetOpacity_: number;
            private targetZoomX_: number;
            private targetZoomY_: number;
            private targetX_: number;
            private targetY_: number;

            private number_: number;
            private name_: string;
            private origin_: number;
            private x_: number;
            private y_: number;
            private zoomX_: number;
            private zoomY_: number;
            private opacity_: number;
            private blendType_: number;
            private tone_: game.Tone;
            private angle_: number;

            //--------------------------------------------------------------------------
            // ● 公開インスタンス変数
            //--------------------------------------------------------------------------
            public get number(): number {return this.number_;}                                     // ピクチャ番号
            public get name(): string {return this.name_;}                                         // ファイル名
            public get origin(): number {return this.origin_;}                                     // 原点
            public get x(): number {return this.x_;}                                                // X 座標
            public get y(): number {return this.y_;}                                                // Y 座標
            public get zoomX(): number {return this.zoomX_;}                                     // X 方向拡大率
            public get zoomY(): number {return this.zoomY_;}                                     // Y 方向拡大率
            public get opacity(): number {return this.opacity_;}                                    // 不透明度
            public get blendType(): number {return this.blendType_;}                             // ブレンド方法
            public get tone(): game.Tone {return this.tone_;}                                         // 色調
            public get angle(): number {return this.angle_;}                                        // 回転角度
            //--------------------------------------------------------------------------
            // ● オブジェクト初期化
            //--------------------------------------------------------------------------
            constructor (number: number) {
                this.number_ = number;
                this.initBasic();
                this.initTarget();
                this.initTone();
                this.initRotate();
            }

            //--------------------------------------------------------------------------
            // ● 基本変数の初期化
            //--------------------------------------------------------------------------
            public initBasic(): void {
                this.name_ = ""
                this.origin_ = this.x_ = this.y_ = 0;
                this.zoomX_ = this.zoomY_ = 100.0;
                this.opacity_ = 255.0;
                this.blendType_ = 1;
            }

            //--------------------------------------------------------------------------
            // ● 移動目標の初期化
            //--------------------------------------------------------------------------
            public initTarget(): void {
                this.targetX_ = this.x_;
                this.targetY_ = this.y_;
                this.targetZoomX_ = this.zoomX_;
                this.targetZoomY_ = this.zoomY_;
                this.targetOpacity_ = this.opacity_;
                this.duration_ = 0;
            }

            //--------------------------------------------------------------------------
            // ● 色調の初期化
            //--------------------------------------------------------------------------
            public initTone(): void {
                this.tone_ = new game.Tone();
                this.toneTarget_ = new game.Tone();
                this.toneDuration_ = 0;
            }

            //--------------------------------------------------------------------------
            // ● 回転の初期化
            //--------------------------------------------------------------------------
            public initRotate(): void {
                this.angle_ = 0;
                this.rotateSpeed_ = 0;
            }

            //--------------------------------------------------------------------------
            // ● ピクチャの表示
            //--------------------------------------------------------------------------
            public show(name: string, 
                        origin: number, 
                        x: number, 
                        y: number, 
                        zoomX: number, 
                        zoomY: number, 
                        opacity: number, 
                        blendType: number): void {
                this.name_ = name;
                this.origin_ = origin;
                this.x_ = x;
                this.y_ = y;
                this.zoomX_ = zoomX;
                this.zoomY_ = zoomY;
                this.opacity_ = opacity;
                this.blendType_ = blendType;
                this.initTarget();
                this.initTone();
                this.initRotate();
            }

            //--------------------------------------------------------------------------
            // ● ピクチャの移動
            //--------------------------------------------------------------------------
            public move(origin: number, 
                        x: number, 
                        y: number, 
                        zoomX: number, 
                        zoomY: number, 
                        opacity: number, 
                        blendType: number, 
                        duration: number): void {
                this.origin_ = origin;
                this.targetX_ = x;
                this.targetY_ = y;
                this.targetZoomX_ = zoomX;
                this.targetZoomY_ = zoomY;
                this.targetOpacity_ = opacity;
                this.blendType_ = blendType;
                this.duration_ = duration;
            }

            //--------------------------------------------------------------------------
            // ● 回転速度の変更
            //--------------------------------------------------------------------------
            public rotate(speed: number): void {
                this.rotateSpeed_ = speed;
            }

            //--------------------------------------------------------------------------
            // ● 色調変更の開始
            //--------------------------------------------------------------------------
            public startToneChange(tone: game.Tone, duration: number): void {
                this.toneTarget_ = tone.clone();
                this.toneDuration_ = duration;
                if (this.toneDuration_ == 0) {
                    this.tone_ = this.toneTarget_.clone();
                }
            }

            //--------------------------------------------------------------------------
            // ● ピクチャの消去
            //--------------------------------------------------------------------------
            public erase(): void {
                this.name_ = "";
            }

            //--------------------------------------------------------------------------
            // ● フレーム更新
            //--------------------------------------------------------------------------
            public update(): void {
                this.updateMove();
                this.updateToneChange();
                this.updateRotate();
            }

            //--------------------------------------------------------------------------
            // ● ピクチャ移動の更新
            //--------------------------------------------------------------------------
            public updateMove(): void {
                if (this.duration_ == 0) {
                    return;
                }
                var d: number = this.duration_;
                this.x_ = (this.x_ * (d - 1) + this.targetX_) / d;
                this.y_ = (this.y_ * (d - 1) + this.targetY_) / d;
                this.zoomX_    = (this.zoomX_    * (d - 1) + this.targetZoomX_)    / d;
                this.zoomY_    = (this.zoomY_    * (d - 1) + this.targetZoomY_)    / d;
                this.opacity_ = (this.opacity_ * (d - 1) + this.targetOpacity_) / d;
                this.duration_ -= 1;
            }

            //--------------------------------------------------------------------------
            // ● 色調変更の更新
            //--------------------------------------------------------------------------
            public updateToneChange(): void {
                if (this.toneDuration_ == 0) {
                    return;
                }
                var d: number = this.toneDuration_;
                this.tone_.red     = (this.tone_.red     * (d - 1) + this.toneTarget_.red)     / d;
                this.tone_.green   = (this.tone_.green   * (d - 1) + this.toneTarget_.green)   / d;
                this.tone_.blue    = (this.tone_.blue    * (d - 1) + this.toneTarget_.blue)    / d;
                this.tone_.gray    = (this.tone_.gray    * (d - 1) + this.toneTarget_.gray)    / d;
                this.toneDuration_ -= 1;
            }

            //--------------------------------------------------------------------------
            // ● 回転の更新
            //--------------------------------------------------------------------------
            public updateRotate(): void {
                if (this.rotateSpeed_ == 0) {
                    return;
                }
                this.angle_ += this.rotateSpeed_ / 2.0;
                while (this.angle_ < 0) {
                    this.angle_ += 360;
                }
                this.angle_ %= 360;
            }
        }
    }
}

