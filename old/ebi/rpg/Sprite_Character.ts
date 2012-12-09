/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../game/TextureCache.ts' />

module ebi {

    export module rpg {

        /**
         * Spriteset_Character
         *
         * All sprites used in map are managed here.
         *
         */
        export class Sprite_Character {
            private static WALK_ANIM_PATTERN_COUNT: number = 3;
            private static TAG_SPRITE_MANAGER: number = 1;
            private static INTERVAL_BASE_DURATION: number = 1.6;
            private static UNIT_DISTANCE_PER_SECOND: number = 16; // pixel

            private static MoveSpeed = {
                VerySlow: 1,
                Slow    : 2,
                Normal  : 4,
                Fast    : 8,
                VeryFast: 16
            };
            private _root: cc.Scene;
            private _sprite: cc.Sprite;
            private _anim: number;
            private _dir: number;
            private _cycleDir: number;
            private _cycleTimer: number;
            private _movingTarget: ebi.game.Point;
            /**
             * Initialize all layers
             */
            constructor(root) {
                this._root = root;
                this._anim = 1;
                this._dir = 2;
                this._cycleDir = 1;

                ebi.game.TextureCache.addImage("res/images/characters/chara01.png");
                this._sprite = cc.Sprite.createWithTexture(
                    ebi.game.TextureCache.getTexture( "res/images/characters/chara01.png"), 
                    cc.rect(32 * this._anim, 48 * this._dir, 32, 48)
                );
                this._sprite.setPosition(cc.p(160, 240));

                this._root.addChild(this._sprite, -1, Sprite_Character.TAG_SPRITE_MANAGER);
            }

            /**
             * Dispose all layers
             */
            public dispose() {
                this._root.removeChild(this._sprite);
            }

            public update(dt: number) {

                // Update character frame
                if (this._updateWalkCycleStep(dt)) {
                    this._updateFrame();
                }

                // Update command
                this.updateCommand(dt);
            }

            public addCommand(commandType: string, data: any) {
                switch (commandType) {
                case "moveTo":
                    this._movingTarget = new ebi.game.Point(data.x, data.y);
                    break;
                }
            }

            private updateCommand(dt: number) {
                if (this._movingTarget) {
                    var moveDistance: number = Sprite_Character.MoveSpeed.Normal * Sprite_Character.UNIT_DISTANCE_PER_SECOND * dt;
                    var currentPosition: cc.Point = this._sprite.getPosition();
                    var dx: number = this._movingTarget.x - currentPosition.x;
                    var dy: number = this._movingTarget.y - currentPosition.y;

                    this._setDir(this._calcDir(dx, dy));

                    var distance2: number = dx * dx + dy * dy;
                    if (moveDistance * moveDistance > distance2) {
                        // If the character is close enought to the destination, snap to the position and stop the movement
                        this._sprite.setPosition(new cc.Point(this._movingTarget.x, this._movingTarget.y));
                        this._movingTarget = null;
                    } else {
                        // Move towards specific direction
                        var tx: number = dx / (Math.abs(dx) + Math.abs(dy));
                        var ty: number = dy / (Math.abs(dx) + Math.abs(dy));
                        var newX: number = currentPosition.x + moveDistance * tx;
                        var newY: number = currentPosition.y + moveDistance * ty;
                        this._sprite.setPosition(new cc.Point(newX, newY));
                    }
                }
            }

            private _calcDir(dx: number, dy: number) {
                var dir:number = (Math.floor(4 * Math.atan2(dy, dx) / Math.PI) + 8) % 8;
                return Math.floor(dir / 2);
                
            }

            // Update walk-cycle of the character
            private _updateWalkCycleStep(dt: number) {
                this._cycleTimer += dt;
                if (this._cycleTimer < Sprite_Character.INTERVAL_BASE_DURATION / Sprite_Character.MoveSpeed.Normal) {
                    return false;
                }
                this._cycleTimer = 0;

                // Update cyncle animation
                this._anim += this._cycleDir;
                if (this._anim === (Sprite_Character.WALK_ANIM_PATTERN_COUNT - 1) || this._anim === 0) {
                    this._cycleDir *= -1;
                }

                return true;   
            }

            private _setDir(dir: number): void {
                this._dir = dir;
                this._updateFrame();
            }

            // Set next frame of the character
            private _updateFrame(): void {
                this._sprite.setTextureRect(
                    cc.rect(32 * this._anim, 48 * this._dir, 32, 48)
                );    
            }
        }

    }

}
