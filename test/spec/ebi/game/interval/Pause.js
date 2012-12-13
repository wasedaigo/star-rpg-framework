var Pause = ebi.game.interval.Pause;

describe('Ebi::Game::Interval::Pause', function(){
    describe('methods', function(){
        it('update', function(){
        	var i = 0;
        	var interval = new Pause(function() {return i == 1});

            expect(interval.isDone).toEqual(false);
            interval.update();
            expect(interval.isDone).toEqual(false);
            i = 1;
            interval.update();
            expect(interval.isDone).toEqual(true);

        }); 

        it('finish', function(){
            var i = 0;
            var interval = new Pause(function() {i == 1});

            expect(interval.isDone).toEqual(false);
            interval.finish();
            expect(interval.isDone).toEqual(true);
        }); 

        it('reset', function(){
            var interval = new Pause(function() {});
            
            interval.finish();
            interval.reset();
            expect(interval.isDone).toEqual(false);
        }); 
    });
});
