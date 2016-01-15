/***************************************************************
 *
 *
 *  2016 Silvan Strübi, http://shoga9team.com
 *
 ***************************************************************/
/*jshint esnext: true */

class MasterOnContact {
    constructor(game = false, parent = false){
        this.game = game; // skip the game reference if you want to use setTimeout instead of this.game.time.events.add
        this.parent = parent; // only used if you need a reference to your parent object

        this.shapeCont = {}; // container keeping the shapes
        this.indexByShapeID = new Map(); // index giving access to shapeCont location by shape.id
    }
    create(timeObject = false, pushCheckFunctionsMap = false, pushEventFunctionsMap = false, spliceEventFunctionsMap = false, addRealtime = true){
        // vars
        if(timeObject){
            this.time = timeObject;
        }
        if(pushCheckFunctionsMap){
            this.pushCheckFunctions = pushCheckFunctionsMap;
        }
        if(pushEventFunctionsMap){
            this.pushEventFunctions = pushEventFunctionsMap;
        }
        if(spliceEventFunctionsMap){
            this.spliceEventFunctions = spliceEventFunctionsMap;
        }
        // remove functions which are not in the time object
        this.cleanFunctionMaps = [this.pushCheckFunctions, this.pushEventFunctions, this.spliceEventFunctions];
        this.cleanFunctionMaps.forEach((functionMap) => {
            for(let [key, value] of functionMap){
                if(!(key in this.time)){
                    functionMap.delete(key);
                }
            }
        });
        // setup containers for shapeCont by time object - direction
        for(let key1 in this.time){
            this.shapeCont[key1] = {};
            // set containers defined by time - timing
            if(addRealtime && !this.time[key1].realtime){
                this.time[key1].realtime = new Map([['onBegin', 0], ['onEnd', 0]]); // set default realtime container
            }
            for(let key2 in this.time[key1]){
                this.shapeCont[key1][key2] = [];
            }
        }
    }
    attach(entity){
        entity.body.onBeginContact.add(this.onBeginContact, this);
        entity.body.onEndContact.add(this.onEndContact, this);
    }
    onBeginContact(bodyA, bodyB, shapeA, shapeB, equation){
        this.pushShape(bodyA, bodyB, shapeA, shapeB, equation);
    }
    onEndContact(bodyA, bodyB, shapeA, shapeB){
        this.spliceShape(bodyA, bodyB, shapeA, shapeB);
    }
    pushShape(bodyA, bodyB, shapeA, shapeB, equation, arrayName = false){ // not all variables are used by push but maybe by custom this.pushCheckFunctions
        // direction of contact for sorting
        let directions = [];
        if(typeof equation === 'string' && equation in this.shapeCont){
            directions.push(equation);
        }else{
            let shapeB_material_name = '';
            if(shapeB.material){
                shapeB_material_name = shapeB.material.name;
            }
            for(let [key, value] of this.pushCheckFunctions){
                // execute each function
                if(value(bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation)){
                    directions.push(key);
                }
            }
        }
        if(directions.length > 0){
            // index this shape directions by shape id
            if(this.indexByShapeID.get(shapeB.id) === undefined){
                this.indexByShapeID.set(shapeB.id, directions);
            }else{
                let indexByShapeID_element = this.indexByShapeID.get(shapeB.id);
                this.indexByShapeID.set(shapeB.id, indexByShapeID_element.concat(directions));
            }
            // set arrays for tracking
            directions.forEach((direction) => {
                if(!arrayName){
                    for(let key in this.shapeCont[direction]){
                        this._pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, key);
                    }
                }else{
                    this._pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                }
            });
        }
    }
    _pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName){
        if(this.shapeCont[direction][arrayName]){
            // delayed handling
            if(this.time[direction][arrayName].get('onBegin') > 0){
                // remove it after the timer (this avoids flickering where sometimes the ground has no contact for couple mil seconds)
                if(this.game){
                    this.game.time.events.add(this.time[direction][arrayName].get('onBegin'), () => {
                        this._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                    });
                }else{
                    setTimeout(() => {this._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);}, this.time[direction][arrayName].get('onBegin'));
                }
            }else{
                this._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
            }
        }
    }
    spliceShape(bodyA, bodyB, shapeA, shapeB, arrayName = false){
        let indexByShapeID_element = this.indexByShapeID.get(shapeB.id);
        if(indexByShapeID_element){
            let directionResult = [];
            indexByShapeID_element.forEach((direction) => {
                // check each direction only once, since each onBeginContact would put the direction only once per object
                if(directionResult.indexOf(direction) === -1){
                    directionResult.push(direction);
                    if(!arrayName){
                        for(let key in this.shapeCont[direction]){
                            this._spliceShape(bodyA, bodyB, shapeA, shapeB, direction, key);
                        }
                    }else{
                        this._spliceShape(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                    }
                }
            });
            // remove direction in indexByShapeID for each element spliced out (this must be done after previous loop)
            directionResult.forEach((direction) => {
                let index = this.indexByShapeID.get(shapeB.id).indexOf(direction);
                if(index > -1){
                    this.indexByShapeID.get(shapeB.id).splice(index, 1);
                }
            });
        }
    }
    _spliceShape(bodyA, bodyB, shapeA, shapeB, direction, arrayName){
        if(this.shapeCont[direction][arrayName]){
            // delayed handling
            if(this.time[direction][arrayName].get('onEnd') > 0){
                // remove it after the timer (this avoids flickering where sometimes the ground has no contact for couple mil seconds)
                if(this.game){
                    this.game.time.events.add(this.time[direction][arrayName].get('onEnd'), () => {
                        this._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                    });
                }else{
                    setTimeout(() => {this._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);}, this.time[direction][arrayName].get('onEnd'));
                }
            }else{
                this._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
            }
            return true; // this should be inside the (index > -1) check to make sure it was removed but most likely is accurate this way, too. It has been moved here to make onBegin time delays accurate
        }
        return false;
    }
    _push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName){
        this.shapeCont[direction][arrayName].push(shapeB);
        // functions to execute
        let pushEventFunction = this.pushEventFunctions.get(direction);
        if(pushEventFunction){
            pushEventFunction(bodyA, bodyB, shapeA, shapeB, equation, this.shapeCont[direction][arrayName], direction, arrayName);
        }
    }
    _splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName){
        let index = this.shapeCont[direction][arrayName].indexOf(shapeB);
        if(index > -1){
            this.shapeCont[direction][arrayName].splice(index, 1);
            // functions to execute
            let spliceEventFunction = this.spliceEventFunctions.get(direction);
            if(spliceEventFunction){
                spliceEventFunction(bodyA, bodyB, shapeA, shapeB, this.shapeCont[direction][arrayName], direction, arrayName);
            }
        }
    }
}