var ebi;
(function (ebi) {
    (function (collision) {
        var Edge = (function () {
            function Edge(start, end) {
                this.start_ = start;
                this.end_ = end;
            }
            Object.defineProperty(Edge.prototype, "start", {
                get: function () {
                    return this.start_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Edge.prototype, "end", {
                get: function () {
                    return this.end_;
                },
                enumerable: true,
                configurable: true
            });
            return Edge;
        })();
        collision.Edge = Edge;        
    })(ebi.collision || (ebi.collision = {}));
    var collision = ebi.collision;

})(ebi || (ebi = {}));

