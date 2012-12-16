var Empty = clock.interval.Empty;

describe('Clock::Interval::Null', function(){
    describe('methods', function(){
        it('update', function(){
            expect(Empty.isDone).toEqual(true);
            Empty.update(1);
            expect(Empty.isDone).toEqual(true);
        }); 

        it('reset', function(){
            Empty.reset();
            expect(Empty.isDone).toEqual(true);
        }); 

        it('finish', function(){
            Empty.finish();
            expect(Empty.isDone).toEqual(true);
        }); 
    });
});
