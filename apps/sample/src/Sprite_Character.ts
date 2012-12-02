///<reference path='../cocos2d.d.ts'/>
/// <reference path='../../../ebi/TextureCache.ts' />
/**
 * Spriteset_Character
 *
 * All sprites used in map are managed here.
 *
 */
class Sprite_Character {
    private static WALK_ANIM_PATTERN_COUNT: number = 3;
    private static TAG_SPRITE_MANAGER: number = 1;
    private static CycleInterval = {
        VerySlow: 0.5,
        Slow    : 0.4,
        Normal  : 0.3,
        Fast    : 0.2,
        VeryFast: 0.1
    };
    private _root: cc.Scene;
    private _sprite: cc.Sprite;
    private _anim: number;
    private _dir: number;
    private _cycleDir: number;
    private _cycleTimer: number;
    private _movingTarget: ebi.Point;
    /**
    * Initialize all layers
    */
    constructor(root) {
        this._root = root;
        this._anim = 1;
        this._dir = 2;
        this._cycleDir = 1;

        ebi.TextureCache.instance.addImage("res/images/characters/chara01.png");

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (Math.random() > .5 ? 0 : 1);
        var idy = (Math.random() > .5 ? 0 : 1);
        this._sprite = cc.Sprite.createWithTexture(
            ebi.TextureCache.instance.getTexture( "res/images/characters/chara01.png"), 
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
        if (this._updateWalkCycleStep(dt)) {
            this._updateFrame();
        }
    }

    // Update walk-cycle of the character
    private _updateWalkCycleStep(dt: number) {
        this._cycleTimer += dt;
        if (this._cycleTimer < Sprite_Character.CycleInterval.Normal) {
            return false;
        }
        this._cycleTimer = 0;
        return true;   
    }

    // Set next frame of the character
    private _updateFrame() {
        this._anim += this._cycleDir;
        if (this._anim === (Sprite_Character.WALK_ANIM_PATTERN_COUNT - 1) || this._anim === 0) {
            this._cycleDir *= -1;
        }

        this._sprite.setTextureRect(
            cc.rect(32 * this._anim, 48 * this._dir, 32, 48)
        );    
    }
}
