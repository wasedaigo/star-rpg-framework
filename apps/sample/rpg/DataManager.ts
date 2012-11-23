///<reference path='Game_Player.ts'/>

/**
 * DataManager
 *
 * データベースとゲームオブジェクトを管理するモジュールです。ゲームで使用する
 * ほぼ全てのグローバル変数はこのモジュールで初期化されます。
 */
module DataManager {
  private _gamePlayer = null;
  /**
  * ●  モジュール初期化
  */
  export function init() {
    DataManager.createGameObjects();
  }

  /**
  * ●  各種ゲームオブジェクトの作成
  */
  export function createGameObjects() {
    this._gamePlayer = new Game_Player();
  }

  /**
  * ●  ゲームプレイヤーを取得
  */
  export function getGamePlayer() {
    return this._gamePlayer;
  }
}
