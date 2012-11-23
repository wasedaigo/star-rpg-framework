var DataManager;
(function (DataManager) {
    DataManager._gamePlayer = null;
    function init() {
        DataManager.createGameObjects();
    }
    DataManager.init = init;
    function createGameObjects() {
        this._gamePlayer = new Game_Player();
    }
    DataManager.createGameObjects = createGameObjects;
    function getGamePlayer() {
        return this._gamePlayer;
    }
    DataManager.getGamePlayer = getGamePlayer;
})(DataManager || (DataManager = {}));

//@ sourceMappingURL=DataManager.js.map
