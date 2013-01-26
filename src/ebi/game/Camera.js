var ebi;
(function (ebi) {
    (function (game) {
        var Camera = (function () {
            function Camera() { }
            Camera.x = 0;
            Camera.y = 0;
            Camera.scaleX = 1;
            Camera.scaleY = 1;
            return Camera;
        })();
        game.Camera = Camera;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

