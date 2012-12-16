var Parallel = clock.interval.Parallel;
var Lerp = clock.interval.Lerp;
var Wait = clock.interval.Wait;
var Func = clock.interval.Func;

describe('Clock::Interval::Parallel', function(){

    function makeTestData(testFunc) {
        return new Parallel([
            new Loop(
                new Sequence([
                    new Lerp(2, 3, 5, "linear", testFunc),
                    new Wait(2, testFunc)
                ])
            ),
            new Wait(5)
        ]);
    };

    describe('methods', function(){
        it('update', function(){
            var i = 0;
            var testFunc = function (self, value) {
                i = value;
            };
        	var interval = makeTestData(testFunc);

            interval.update(1);
            expect(i).toEqual(4);
            interval.update(1);
            expect(i).toEqual(5);
            interval.update(1);
            expect(i).toEqual(1);
            interval.update(1);
            expect(i).toEqual(2);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(i).toEqual(4);
            expect(interval.isDone).toEqual(true);
            interval.update(1);
            expect(i).toEqual(4);
            expect(interval.isDone).toEqual(true);

        }); 

        it('infinite', function(){
            var interval1 = new Parallel([
                new Loop(new Sequence([new Wait(5)])),
                new Wait(5)
            ]);
            expect(interval1.isInfiniteLoop).toEqual(false);

            var interval2 = new Parallel([
                new Loop(new Sequence([new Wait(5)])),
                new Loop(new Sequence([new Wait(5)]))
            ]);
            expect(interval2.isInfiniteLoop).toEqual(true);
        });

        it('finish', function(){
            var interval = makeTestData(null);

            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
        }); 

        it('reset', function(){
            var testFunc = function (self, i) {};
            var interval = makeTestData(testFunc);

            expect(interval.isDone).toEqual(false);
            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        }); 
    });
});
