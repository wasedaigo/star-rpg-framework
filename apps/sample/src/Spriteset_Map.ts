///<reference path='../cocos2d.d.ts'/>
///<reference path='Game_Player.ts'/>
///<reference path='Sprite_Character.ts'/>
///<reference path='Scene_Base.ts'/>
///<reference path='../../../ebi/TextureCache.ts' />

/**
 * Spriteset_Map
 *
 * All sprites used in map are managed here.
 *
 */
class Spriteset_Map {
    private _gamePlayer: Game_Player;
    private _root: Scene_Base = null;
    private _map: cc.TMXTiledMap = null;
    private _background: cc.Sprite = null;
    private _character: Sprite_Character = null;

    /**
    * Initialize all layers
    */
    constructor(root:Scene_Base) {
        this._root = root;
        this.createTilemap();
        //this.createCharacters();
        this.createGamePlayer();
        this.createPictures();
        /*
        create_parallax
        create_characters
        create_shadow
        create_weather
        create_pictures
        create_timer
        update
        */
    }

    /**
     * Dispose all layers
     */
    public dispose() {
        this._root.removeChild(this._map);
        //this._character.dispose();
    }

    private createTilemap() {
        //Display TileMap
        this._map = cc.TMXTiledMap.create("res/tmx/sample.tmx");
        this._map.setPosition(cc.p(0, 0));
        this._root.addChild(this._map, -1, 1);    
    }

    private createPictures() {   
        // setup title image
        ebi.game.TextureCache.instance.addImage("res/images/game/panorama/room.png");
        this._background = cc.Sprite.createWithTexture(
            ebi.game.TextureCache.instance.getTexture("res/images/game/panorama/room.png"), 
            cc.rect(0, 0, 240, 240)
        );
        this._background.setAnchorPoint(cc.p(0, 0));
        this._root.addChild(this._background, -2);
    }

    private createCharacters() {
        this._character = new Sprite_Character(this._root);
    }

    public createGamePlayer() {
        this._gamePlayer = new Game_Player(this._root);
    }

    public getGamePlayer(): Game_Player {
        return this._gamePlayer;
    }

    public disposeGamePlayer() {
        this._gamePlayer.dispose();
        this._gamePlayer = null;
    }

    public update(dt:number) {
        this._gamePlayer.update(dt);
    }
}
