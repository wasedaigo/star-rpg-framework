var ebi;
(function (ebi) {
    (function (rpg) {
        (function (ui) {
            var AnalogInputController = (function () {
                function AnalogInputController() { }
                AnalogInputController.MinInputValue = 8;
                AnalogInputController.MaxInputValue = 48;
                AnalogInputController.touchStartLocationX_ = 0;
                AnalogInputController.touchStartLocationY_ = 0;
                AnalogInputController.inputDx_ = 0;
                AnalogInputController.inputDy_ = 0;
                AnalogInputController.roundValue = function roundValue(value, min, max) {
                    if(value > 0) {
                        value = value < min ? 0 : value;
                        value = value > max ? max : value;
                    } else {
                        value = value > min ? 0 : value;
                        value = value < -max ? -max : value;
                    }
                    return value;
                }
                AnalogInputController.update = function update() {
                    AnalogInputController.inputDx_ = 0;
                    AnalogInputController.inputDy_ = 0;
                    if(ebi.game.Input.isNewlyTouched) {
                        AnalogInputController.touchStartLocationX_ = ebi.game.Input.touchX;
                        AnalogInputController.touchStartLocationY_ = ebi.game.Input.touchY;
                    }
                    if(ebi.game.Input.isTouched) {
                        var dx = ebi.game.Input.touchX - AnalogInputController.touchStartLocationX_;
                        var dy = ebi.game.Input.touchY - AnalogInputController.touchStartLocationY_;
                        if((dx * dx + dy * dy) > AnalogInputController.MinInputValue * AnalogInputController.MinInputValue) {
                            AnalogInputController.inputDx_ = AnalogInputController.roundValue(dx, 0, AnalogInputController.MaxInputValue) / AnalogInputController.MaxInputValue;
                            AnalogInputController.inputDy_ = AnalogInputController.roundValue(dy, 0, AnalogInputController.MaxInputValue) / AnalogInputController.MaxInputValue;
                        }
                    }
                }
                Object.defineProperty(AnalogInputController, "inputDx", {
                    get: function () {
                        return AnalogInputController.inputDx_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogInputController, "inputDy", {
                    get: function () {
                        return AnalogInputController.inputDy_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogInputController, "hasInput", {
                    get: function () {
                        return AnalogInputController.inputDx_ != 0 || AnalogInputController.inputDy_ != 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogInputController, "isTouched", {
                    get: function () {
                        return ebi.game.Input.isTouched;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogInputController, "touchX", {
                    get: function () {
                        return AnalogInputController.touchStartLocationX_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnalogInputController, "touchY", {
                    get: function () {
                        return AnalogInputController.touchStartLocationY_;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AnalogInputController;
            })();
            ui.AnalogInputController = AnalogInputController;            
        })(rpg.ui || (rpg.ui = {}));
        var ui = rpg.ui;

    })(ebi.rpg || (ebi.rpg = {}));
    var rpg = ebi.rpg;

})(ebi || (ebi = {}));

