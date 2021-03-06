/**
* Box2DWeb-2.1.d.ts Copyright (c) 2012 Josh Baldwin http://github.com/jbaldwin/box2dweb.d.ts
* There are a few competing javascript Box2D ports.
* This definitions file is for Box2dWeb.js ->
*   http://code.google.com/p/box2dweb/
*
* Box2D C++ Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
**/

/// <reference path="b2Fixture.d.ts" />

module Box2D.Dynamics {

	/**
	* Implement this class to provide collision filtering. In other words, you can implement this class if you want finer control over contact creation.
	**/
	export class b2ContactFilter {

		/**
		* Return true if the given fixture should be considered for ray intersection. By default, userData is cast as a b2Fixture and collision is resolved according to ShouldCollide.
		* @note This function is not in the box2dweb.as code -- might not work.
		* @see b2World.Raycast()
		* @see b2ContactFilter.ShouldCollide()
		* @userData User provided data.  Comments indicate that this might be a b2Fixture.
		* @return True if the fixture should be considered for ray intersection, otherwise false.
		**/
		public RayCollide(userData: any): bool;

		/**
		* Return true if contact calculations should be performed between these two fixtures.
		* @warning For performance reasons this is only called when the AABBs begin to overlap.
		* @fixtureA b2Fixture potentially colliding with fixtureB.
		* @fixtureB b2Fixture potentially colliding with fixtureA.
		* @return True if fixtureA and fixtureB probably collide requiring more calculations, otherwise false.
		**/
		public ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): bool;
	}
}
