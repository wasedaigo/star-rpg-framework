///<reference path='../cocos2d.d.ts'/>
///<reference path='Sprite_Character.ts'/>
/**
 * Spriteset_Map
 *
 * All sprites used in map are managed here.
 *
 */
class Spriteset_Map {
  private _root: cc.Scene = null;
  private _map: cc.TMXTiledMap = null;
  private _character: Sprite_Character = null;

  /**
  * Initialize all layers
  */
  constructor(root:cc.Scene) {
    this._root = root;
    this.createTilemap();
    this.createCharacters();
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
    this._character.dispose();
  }

  private createTilemap() {
    //Display TileMap
    this._map = cc.TMXTiledMap.create("res/tmx/sample.tmx");
    this._map.setPosition(cc.p(0, 0));
    this._root.addChild(this._map, -1, 1);    
  }

  private createCharacters() {
    this._character = new Sprite_Character(this._root);
  }
}
