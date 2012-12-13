var Step = ebi.game.interval.Step;

describe('Ebi::Game::Interval', function(){
    describe('methods', function(){
        it('update', function(){
        	var i = 0;
        	var result = [-3, -1, 0, 1, 3, 5];
        	var step = new Step(5, -5, 5, "linear", function(step, value) {
        		expect(value).toEqual(result[i]);
        		i++;
        	});

        	step.update(1);
            expect(step.isDone).toEqual(false);
        	step.update(1);
            expect(step.isDone).toEqual(false);
        	step.update(0.5);
            expect(step.isDone).toEqual(false);
        	step.update(0.5);
            expect(step.isDone).toEqual(false);
        	step.update(1);
            expect(step.isDone).toEqual(false);
            step.update(1);
            expect(step.isDone).toEqual(true);
        });     
    });
});