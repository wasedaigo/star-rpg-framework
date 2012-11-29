///<reference path='../cocos2d.d.ts'/>
/**
 * Spriteset_Character
 *
 * All sprites used in map are managed here.
 *
 */
class Sprite_Character {
    private static TAG_SPRITE_MANAGER:number = 1;
    private _batch:cc.SpriteBatchNode;
    private _root:cc.Scene;
    /**
    * Initialize all layers
    */
    constructor(root) {
        this._root = root;

        this._batch = cc.SpriteBatchNode.create("res/images/characters/chara01.png", 150);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (Math.random() > .5 ? 0 : 1);
        var idy = (Math.random() > .5 ? 0 : 1);
        var sprite = cc.Sprite.createWithTexture(this._batch.getTexture(), cc.rect(32 * idx, 48 * idy, 32, 48));
        this._batch.addChild(sprite);
        sprite.setPosition(cc.p(160, 240));

        this._root.addChild(this._batch, -1, Sprite_Character.TAG_SPRITE_MANAGER);
    }

    /**
    * Dispose all layers
    */
    public dispose() {
        this._root.removeChild(this._batch);
    }

    public update(dt:number) {
    }
}
