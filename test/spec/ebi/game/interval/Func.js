var Func = ebi.game.interval.Func;

describe('Ebi::Game::Interval::Func', function(){
    describe('methods', function(){
        it('update', function(){
        	var i = 0;
        	var interval = new Func(function() {i++;});

            expect(interval.isDone).toEqual(false);
        	interval.update(1);
            expect(interval.isDone).toEqual(true);
            expect(i).toEqual(1);
        }); 

        it('finish', function(){
            var i = 0;
            var interval = new Func(function() {i++;});

            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
            expect(i).toEqual(0);
        }); 

        it('reset', function(){
            var interval = new Func();

            expect(interval.isDone).toEqual(false);
            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        });
    });
});