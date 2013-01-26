var ebi;
(function (ebi) {
    (function (game) {
        var DisplayObjects = (function () {
            function DisplayObjects() { }
            DisplayObjects.objectId_ = 0;
            DisplayObjects.getObjectId = function getObjectId(object) {
                if(!object) {
                    return 0;
                }
                if(!object.hasOwnProperty('_objectId')) {
                    DisplayObjects.objectId_++;
                    object['_objectId'] = DisplayObjects.objectId_;
                }
                return object['_objectId'];
            }
            DisplayObjects.drawablesToAdd_ = [];
            DisplayObjects.drawablesToRemove_ = [];
            DisplayObjects.drawablesToReorder_ = [];
            Object.defineProperty(DisplayObjects, "drawablesToAdd", {
                get: function () {
                    return DisplayObjects.drawablesToAdd_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObjects, "drawablesToRemove", {
                get: function () {
                    return DisplayObjects.drawablesToRemove_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObjects, "drawablesToReorder", {
                get: function () {
                    return DisplayObjects.drawablesToReorder_;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObjects.add = function add(drawable) {
                var id = DisplayObjects.getObjectId(drawable);
                DisplayObjects.drawablesToAdd_.push(drawable);
                return id;
            }
            DisplayObjects.clearDrawablesToAdd = function clearDrawablesToAdd() {
                DisplayObjects.drawablesToAdd_.length = 0;
            }
            DisplayObjects.remove = function remove(drawable) {
                DisplayObjects.drawablesToRemove_.push(drawable);
            }
            DisplayObjects.clearDrawablesToRemove = function clearDrawablesToRemove() {
                DisplayObjects.drawablesToRemove_.length = 0;
            }
            DisplayObjects.addDrawableToReorder = function addDrawableToReorder(drawable) {
                DisplayObjects.drawablesToReorder_.push(drawable);
            }
            DisplayObjects.clearDrawablesToReorder = function clearDrawablesToReorder() {
                DisplayObjects.drawablesToReorder_.length = 0;
            }
            return DisplayObjects;
        })();
        game.DisplayObjects = DisplayObjects;        
    })(ebi.game || (ebi.game = {}));
    var game = ebi.game;

})(ebi || (ebi = {}));

