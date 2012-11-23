var SceneManager;
(function (SceneManager) {
    var scene = null;
    var stack = [];
    var backgroundTexture = null;
    function back() {
        scene = stack.pop();
    }
    SceneManager.back = back;
    function clear() {
        stack = [];
    }
    SceneManager.clear = clear;
    function exit() {
        scene = null;
    }
    SceneManager.exit = exit;
    function getBackgroundTexture() {
        return backgroundTexture;
    }
    SceneManager.getBackgroundTexture = getBackgroundTexture;
})(SceneManager || (SceneManager = {}));

//@ sourceMappingURL=SceneManager.js.map
