var ebi;
(function (ebi) {
    (function (game) {
        var Input = (function () {
            function Input() { }
            Input.isTouched_ = false;
            Input.isNewlyTouched_ = false;
            Input.touchX_ = 0;
            Input.touchY_ = 0;
            Input.lastAction_ = '';
            Object.defineProperty(Input, "isTouched", {
                get: function () {
                    return Input.isTouched_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Input, "isNewlyTouched", {
                get: function () {
                    return Input.isNewlyTouched_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Input, "touchX", {
                get: function () {
                    return Input.touchX_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Input, "touchY", {
                get: function () {
                    return Input.touchY_;
                },
                enumerable: true,
                configurable: true
            });
            Input.beginTouch = function beginTouch(touchX, touchY) {
                Input.touchX_ = touchX;
                Input.touchY_ = touchY;
                Input.isTouched_ = true;
                Input.lastAction_ = 'touchBegan';
            }
            Input.moveTouch = function moveTouch(touchX, touchY) {
                Input.touchX_ = touchX;
                Input.touchY_ = touchY;
                Input.lastAction_ = 'touchMoved';
            }
            Input.endTouch = function endTouch(touchX, touchY) {
                Input.touchX_ = touchX;
                Input.touchY_ = touchY;
                Input.lastAction_ = 'touchEnded';
                Input.isTouched_ = false;
            }
            Input.update = function update() {
                Input.isNewlyTouched_ = false;
                if(Input.lastAction_ === 'touchBegan') {
                    Input.isNewlyTouched_ = true;
                }
                Input.lastAction_ = '';
            }
            return Input;
        })();
        game.Input = Input;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

