var Table = clock.util.Table;

describe('Clock::util::Table', function(){
    describe('methods', function(){
        it('testWidth', function(){
            var table = new Table(4, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            expect(4).toEqual(table.width);
            expect(3).toEqual(table.height);
            expect([4, 3]).toEqual(table.size);

            var table = new Table(2, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            expect(2).toEqual(table.width);
            expect(6).toEqual(table.height);
            expect([2, 6]).toEqual(table.size);
        }); 

        it('testIndex', function(){
            var table = new Table(2, [1, 2, 3, 4, 5, 6, 7, 8]);

            expect(2).toEqual(table.width);
            expect(4).toEqual(table.height);
            expect(1).toEqual(table.get(0, 0));
            expect(4).toEqual(table.get(1, 1));
            expect(5).toEqual(table.get(0, 2));
            expect(8).toEqual(table.get(1, 3));
        }); 
    });
});