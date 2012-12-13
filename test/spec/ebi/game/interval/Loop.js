var Loop = ebi.game.interval.Loop;
var Sequence = ebi.game.interval.Sequence;
var Step = ebi.game.interval.Step;
var Func = ebi.game.interval.Func;

describe('Ebi::Game::Interval::Loop', function(){
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
