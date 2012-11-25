///<reference path='rpg2d.ts'/>
///<reference path='Scene_Title.ts'/>

/**
 * DataManager
 *
 * データベースとゲームオブジェクトを管理するモジュールです。ゲームで使用する
 * ほぼ全てのグローバル変数はこのモジュールで初期化されます。
 */
function main(config) {
	rpg2d.SceneDirector.runWithScene(new Scene_Title(), config);
}