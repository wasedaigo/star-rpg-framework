var Loop = clock.interval.Loop;
var Sequence = clock.interval.Sequence;
var Step = clock.interval.Step;
var Func = clock.interval.Func;

describe('Clock::Interval::Loop', function(){
    describe('methods', function(){
        it('loop3', function(){
        	var i = 0;
            var j = 0;
        	var interval = new Loop(new Sequence([
                new Step(2, 0, 2, "linear", function() {
                    i++;
                }),
                new Func(function() {
                    j++;
                })
            ]), 3);

            expect(interval.isInfiniteLoop).toEqual(false);

            // Looks like having Func is consuming extra 1 step here..
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(true);
        }); 

        it('loop-infinite', function(){
            var v = 0;
            var interval = new Loop(new Step(2, 0, 2, "linear", function(self, value){v = value;}));

            expect(interval.isInfiniteLoop).toEqual(true);
            for (var i = 0; i < 10; i++) {
                interval.update(1);
                expect(v).toEqual(1);
                expect(interval.isDone).toEqual(false);

                interval.update(1);
                expect(v).toEqual(2);
                expect(interval.isDone).toEqual(false);
            }
        }); 

        it('finish', function(){
            var interval = new Loop(new Func());

            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
        }); 

        it('reset', function(){
            var interval = new Loop(new Func());
            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        }); 
    });
});
