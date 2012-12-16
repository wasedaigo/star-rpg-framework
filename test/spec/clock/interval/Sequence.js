var Sequence = clock.interval.Sequence;
var Lerp = clock.interval.Lerp;
var Wait = clock.interval.Wait;
var Func = clock.interval.Func;

describe('Clock::Interval::Sequence', function(){
    describe('methods', function(){
        it('update', function(){
            var i = 0;
            var j = 0;
        	var interval = new Sequence([
                new Lerp(2, 0, 2, "linear", function(self, value) {i++;}),
                new Func(function(self) {i++;}),
                new Wait(2, function(self) {j++;})
            ]);

            interval.update(1);
            interval.update(1);
            interval.update(1);
            expect(i).toEqual(3);
            expect(j).toEqual(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(j).toEqual(2);
            expect(interval.isDone).toEqual(true);
        }); 

        it('infinite', function(){
            var interval1 = new Sequence([
                new Loop(new Sequence([new Wait(5)])),
                new Wait(5)
            ]);
            expect(interval1.isInfiniteLoop).toEqual(true);
        });

        it('finish', function(){
            var interval = new Sequence([
                new Lerp(2, 0, 2),
                new Func(),
                new Wait(2)
            ]);

            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
        }); 


        it('reset', function(){
            var interval = new Sequence([
                new Lerp(2, 0, 2),
                new Func(),
                new Wait(2)
            ]);

            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        }); 
    });
});
