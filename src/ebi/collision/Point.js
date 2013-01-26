var ebi;
(function (ebi) {
    (function (collision) {
        var Point = (function () {
            function Point(x, y) {
                this.x_ = 0;
                this.y_ = 0;
                this.x_ = x;
                this.y_ = y;
            }
            Object.defineProperty(Point.prototype, "x", {
                get: function () {
                    return this.x_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "y", {
                get: function () {
                    return this.y_;
                },
                enumerable: true,
                configurable: true
            });
            return Point;
        })();
        collision.Point = Point;        
    })(ebi.collision || (ebi.collision = {}));
    var collision = ebi.collision;

})(ebi || (ebi = {}));

