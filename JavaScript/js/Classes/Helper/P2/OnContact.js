/***************************************************************
 *
 *  Copyright notice
 *
 *  (c) 2014 Silvan Strübi, http://shoga9team.com
 *
 *  All rights reserved
 ***************************************************************/
 /*jshint esnext: true */

// !!! IMPORTANT !!! [NOTE:] body gets an onEndContact event when fallen asleep, if body allowSleep not deactivated. Prevent this by setting: "this.entity.body.allowSleep = false;" or use NarrowphaseOnContact

// This Helper basically keeps objects - included onBeginContact and excluded after onEndContact, this way you can know when a contact is existent.
// It gives the option to define custom logic when an object gets added and what to execute on adding and removing
class OnContact extends MasterOnContact {
	// minPointContact defines the point from where a contact is confirmed
	constructor(game, parent, minPointContact = 0){
		super(game, parent);

		this.name = 'OnContact';
		// this.minPointContact is only for use for functions declared directly here, else the scope should be where this gets created by adding arrow functions
		this.minPointContact = minPointContact;
		// time defines different time handling on how to delay the splice (when to release the shape), realtime is set as default with "0"
		// presets objects and map, which can be overwritten by this.time / also use this to add tracking delays if needed [NOTE:] onBegin must always be smaller or equal than onEnd!
		this.time = {
			top: {},
			right: {},
			bottom: {
				delayed: new Map([['onBegin', 0], ['onEnd', 150]])
			},
			left: {},
			on: {}
		};
		// functions must be represented by an object with the same key inside this.time to take effect and vice versa to validate entry into shapeCont
		this.pushCheckFunctions = new Map([
			['top', (body, shapeA, shapeB, shapeB_material_name, equation) => {return equation[0].contactPointA[1] > this.minPointContact;}],
			['right', (body, shapeA, shapeB, shapeB_material_name, equation) => {return equation[0].contactPointA[0] < -this.minPointContact;}],
			['bottom', (body, shapeA, shapeB, shapeB_material_name, equation) => {return equation[0].contactPointA[1] < -this.minPointContact;}],
			['left', (body, shapeA, shapeB, shapeB_material_name, equation) => {return equation[0].contactPointA[0] > this.minPointContact;}],
			['on', (body, shapeA, shapeB, shapeB_material_name, equation) => {return true;}]
			]);
		// functions must be represented by an object with the same key inside this.time to take effect
		this.pushEventFunctions = new Map([
			['top', (body, shapeA, shapeB, equation, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);}],
			['right', (body, shapeA, shapeB, equation, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);}],
			['bottom', (body, shapeA, shapeB, equation, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);}],
			['left', (body, shapeA, shapeB, equation, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);}],
			['on', (body, shapeA, shapeB, equation, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);}]
			]);
		// functions must be represented by an object with the same key inside this.time to take effect
		this.spliceEventFunctions = new Map([
			['top', (body, shapeA, shapeB, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);}],
			['right', (body, shapeA, shapeB, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);}],
			['bottom', (body, shapeA, shapeB, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);}],
			['left', (body, shapeA, shapeB, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);}],
			['on', (body, shapeA, shapeB, array, direction, arrayName) => {console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);}]
			]);
	}
	// INDEPENTENT FROM FUNCTIONS ABOVE! But convenient to use in conjunction with check functions, use this to set special properties to shapes
	// noCollisionResponses handling
	setSpecialCollisionResponse(map = new Map([['active', true], ['AI', () => {return parent._aiActive;}]]), body, shape, collision = true, equation = true){
		if(!collision){
			if(equation){
				// collisionResponse = false has no collision but onBeginContact still receives an equation
				shape.collisionResponse = false;
			}else{
				// sensor = true has no collision and onBeginContact does only receive the contact without equation
				shape.sensor = true;
			}
		}
		shape.sst_parent = body;
		return shape.sst_type = map;
	}
}