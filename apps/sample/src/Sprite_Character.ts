///<reference path='../cocos2d.d.ts'/>
/// <reference path='../../../ebi/TextureCache.ts' />
/**
 * Spriteset_Character
 *
 * All sprites used in map are managed here.
 *
 */
class Sprite_Character {
    private static TAG_SPRITE_MANAGER:number = 1;
    private static CYCLE_INTERVAL:number = 0.2;
    private _batch:cc.SpriteBatchNode;
    private _root:cc.Scene;
    private _sprite:cc.Sprite;
    private _anim:number;
    private _dir:number;
    private _cycleDir:number;
    private _cycleTimer:number;
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
        this._root.removeChild(this._batch);
    }

    public update(dt:number) {
        this._updateFrame(dt);
    }

    // Update character frame
    private _updateFrame(dt:number) {
        this._cycleTimer += dt;
        if (this._cycleTimer < Sprite_Character.CYCLE_INTERVAL) {
            return;
        }
        this._cycleTimer = 0;

        this._nextFrame();
    }

    // Set next frame of the character
    private _nextFrame() {
        this._anim += this._cycleDir;
        if (this._anim === 2 || this._anim === 0) {
            this._cycleDir *= -1;
        }

        this._sprite.setTextureRect(
            cc.rect(32 * this._anim, 48 * this._dir, 32, 48)
        );    
    }
}
