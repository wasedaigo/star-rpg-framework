///<reference path='DataManager.ts'/>
///<reference path='Scene_Title.ts'/>
/**
 * SceneManager
 *
 * シーン遷移を管理するモジュールです。たとえばメインメニューからアイテム画面を呼び出し、
 * また戻るというような階層構造を扱うことができます。
 */
module SceneManager {
  /**
  * ●  モジュールのインスタンス変数
  */
  var scene = null;	    	               // 現在のシーンオブジェクト
  var stack = [];                          // 階層遷移用のスタック
  var backgroundTexture = null;            // 背景用テクスチャ

  /**
  # ● 呼び出し元へ戻る
  */
  export function back() {
    scene = stack.pop();
  }
  /**
  # ● 呼び出しスタックのクリア
  */
  export function clear() {
    stack = [];
  }
  /**
  # ● ゲーム終了
  */
  export function exit() {
    scene = null;
  }
  /**
  # ● 背景用ビットマップを取得
  */
  export function getBackgroundTexture() {
    return backgroundTexture;
  }
}
