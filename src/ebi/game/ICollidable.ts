/// <reference path='../../b2/Box2D.d.ts' />
/// <reference path='../../cp/chipmunk.d.ts' />

module ebi.game {
    export interface ICollidable {
    	destroy(world: Box2D.Dynamics.b2World): void;
        setPos(x: number, y: number): void;
        setVelocity(vx: number, vy: number): void;
        x: number;
        y: number;
        id: number;
    }
}
