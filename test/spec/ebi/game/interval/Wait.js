var Wait = ebi.game.interval.Wait;

describe('Ebi::Game::Interval::Wait', function(){
    describe('methods', function(){
        it('update', function(){
        	var i = 0;
        	var interval = new Wait(2, function() {i++;});

            expect(interval.isDone).toEqual(false);
        	interval.update(1);
            expect(interval.isDone).toEqual(false);
            interval.update(1);
            expect(interval.isDone).toEqual(true);
        }); 

        it('finish', function(){
            var i = 0;
            var interval = new Wait(5, function() {i++;});

            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
            expect(i).toEqual(0);
        }); 
    });
});
