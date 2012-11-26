///<reference path='rpg2d.ts'/>
/**
 * Spriteset_Map
 *
 * All sprites used in map are managed here.
 *
 */
class Spriteset_Map {
  private _root: rpg2d.Scene = null;
  private _map: rpg2d.TileMap = null;
  /**
  * Initialize all layers
  */
  constructor(root:rpg2d.Scene) {
    this._root = root;
    this.createTilemap();
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
  }

  private createTilemap() {
    //Display TileMap
    this._map = rpg2d.TileMap.create("res/tmx/ortho-objects.tmx");
    this._root.addChild(this._map, -1, 1);    
  }
}
