var Step = clock.interval.Step;

describe('Clock::Interval::Step', function(){
    describe('methods', function(){
        it('update', function(){
        	var i = 0;
        	var result = [-3, -1, 0, 1, 3, 5];
        	var interval = new Step(5, -5, 5, "linear", function(interval, value) {
        		expect(value).toEqual(result[i]);
        		i++;
        	});

        	interval.update(1);
            expect(interval.isDone).toEqual(false);
        	interval.update(1);
            expect(interval.isDone).toEqual(false);
        	interval.update(0.5);
            expect(interval.isDone).toEqual(false);
        	interval.update(0.5);
            expect(interval.isDone).toEqual(false);
        	interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(true);
        }); 

        it('finish', function(){
            var interval = new Step(1, -5, 5, "linear", function(interval, value) {});
            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
        }); 

        it('reset', function(){
            var interval = new Step(1, -5, 5, "linear", function(interval, value) {});
            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        }); 
    });
});