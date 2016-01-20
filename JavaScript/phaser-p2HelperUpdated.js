/***************************************************************
 *
 *
 *  2016 Silvan Strübi, http://shoga9team.com
 *
 ***************************************************************/
/*jshint esnext: true */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MasterOnContact = (function () {
    function MasterOnContact() {
        var game = arguments[0] === undefined ? false : arguments[0];
        var parent = arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, MasterOnContact);

        this.game = game; // skip the game reference if you want to use setTimeout instead of this.game.time.events.add
        this.parent = parent; // only used if you need a reference to your parent object

        this.shapeCont = {}; // container keeping the shapes
        this.indexByShapeID = new Map(); // index giving access to shapeCont location by shape.id
    }

    _createClass(MasterOnContact, [{
        key: 'create',
        value: function create() {
            var timeObject = arguments[0] === undefined ? false : arguments[0];
            var pushCheckFunctionsMap = arguments[1] === undefined ? false : arguments[1];
            var pushEventFunctionsMap = arguments[2] === undefined ? false : arguments[2];

            var _this = this;

            var spliceEventFunctionsMap = arguments[3] === undefined ? false : arguments[3];
            var addRealtime = arguments[4] === undefined ? true : arguments[4];

            // vars
            if (timeObject) {
                this.time = timeObject;
            }
            if (pushCheckFunctionsMap) {
                this.pushCheckFunctions = pushCheckFunctionsMap;
            }
            if (pushEventFunctionsMap) {
                this.pushEventFunctions = pushEventFunctionsMap;
            }
            if (spliceEventFunctionsMap) {
                this.spliceEventFunctions = spliceEventFunctionsMap;
            }
            // remove functions which are not in the time object
            this.cleanFunctionMaps = [this.pushCheckFunctions, this.pushEventFunctions, this.spliceEventFunctions];
            this.cleanFunctionMaps.forEach(function (functionMap) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = functionMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2);

                        var key = _step$value[0];
                        var value = _step$value[1];

                        if (!(key in _this.time)) {
                            functionMap['delete'](key);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
            // setup containers for shapeCont by time object - direction
            for (var key1 in this.time) {
                this.shapeCont[key1] = {};
                // set containers defined by time - timing
                if (addRealtime && !this.time[key1].realtime) {
                    this.time[key1].realtime = new Map([['onBegin', 0], ['onEnd', 0]]); // set default realtime container
                }
                for (var key2 in this.time[key1]) {
                    this.shapeCont[key1][key2] = [];
                }
            }
        }
    }, {
        key: 'attach',
        value: function attach(entity) {
            entity.body.onBeginContact.add(this.onBeginContact, this);
            entity.body.onEndContact.add(this.onEndContact, this);
        }
    }, {
        key: 'onBeginContact',
        value: function onBeginContact(bodyA, bodyB, shapeA, shapeB, equation) {
            this.pushShape(bodyA, bodyB, shapeA, shapeB, equation);
        }
    }, {
        key: 'onEndContact',
        value: function onEndContact(bodyA, bodyB, shapeA, shapeB) {
            this.spliceShape(bodyA, bodyB, shapeA, shapeB);
        }
    }, {
        key: 'pushShape',
        value: function pushShape(bodyA, bodyB, shapeA, shapeB, equation) {
            var _this2 = this;

            var arrayName = arguments[5] === undefined ? false : arguments[5];
            // not all variables are used by push but maybe by custom this.pushCheckFunctions
            // direction of contact for sorting
            var directions = [];
            if (typeof equation === 'string' && equation in this.shapeCont) {
                directions.push(equation);
            } else {
                var shapeB_material_name = '';
                if (shapeB.material) {
                    shapeB_material_name = shapeB.material.name;
                }
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.pushCheckFunctions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2);

                        var key = _step2$value[0];
                        var value = _step2$value[1];

                        // execute each function
                        if (value(bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation)) {
                            directions.push(key);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            if (directions.length > 0) {
                // index this shape directions by shape id
                if (this.indexByShapeID.get(shapeB.id) === undefined) {
                    this.indexByShapeID.set(shapeB.id, directions);
                } else {
                    var indexByShapeID_element = this.indexByShapeID.get(shapeB.id);
                    this.indexByShapeID.set(shapeB.id, indexByShapeID_element.concat(directions));
                }
                // set arrays for tracking
                directions.forEach(function (direction) {
                    if (!arrayName) {
                        for (var key in _this2.shapeCont[direction]) {
                            _this2._pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, key);
                        }
                    } else {
                        _this2._pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                    }
                });
            }
        }
    }, {
        key: '_pushShape',
        value: function _pushShape(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName) {
            var _this3 = this;

            if (this.shapeCont[direction][arrayName]) {
                // delayed handling
                if (this.time[direction][arrayName].get('onBegin') > 0) {
                    // remove it after the timer (this avoids flickering where sometimes the ground has no contact for couple mil seconds)
                    if (this.game) {
                        this.game.time.events.add(this.time[direction][arrayName].get('onBegin'), function () {
                            _this3._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                        });
                    } else {
                        setTimeout(function () {
                            _this3._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                        }, this.time[direction][arrayName].get('onBegin'));
                    }
                } else {
                    this._push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName);
                }
            }
        }
    }, {
        key: 'spliceShape',
        value: function spliceShape(bodyA, bodyB, shapeA, shapeB) {
            var _this4 = this;

            var arrayName = arguments[4] === undefined ? false : arguments[4];

            var indexByShapeID_element = this.indexByShapeID.get(shapeB.id);
            if (indexByShapeID_element) {
                (function () {
                    var directionResult = [];
                    indexByShapeID_element.forEach(function (direction) {
                        // check each direction only once, since each onBeginContact would put the direction only once per object
                        if (directionResult.indexOf(direction) === -1) {
                            directionResult.push(direction);
                            if (!arrayName) {
                                for (var key in _this4.shapeCont[direction]) {
                                    _this4._spliceShape(bodyA, bodyB, shapeA, shapeB, direction, key);
                                }
                            } else {
                                _this4._spliceShape(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                            }
                        }
                    });
                    // remove direction in indexByShapeID for each element spliced out (this must be done after previous loop)
                    directionResult.forEach(function (direction) {
                        var index = _this4.indexByShapeID.get(shapeB.id).indexOf(direction);
                        if (index > -1) {
                            _this4.indexByShapeID.get(shapeB.id).splice(index, 1);
                        }
                    });
                })();
            }
        }
    }, {
        key: '_spliceShape',
        value: function _spliceShape(bodyA, bodyB, shapeA, shapeB, direction, arrayName) {
            var _this5 = this;

            if (this.shapeCont[direction][arrayName]) {
                // delayed handling
                if (this.time[direction][arrayName].get('onEnd') > 0) {
                    // remove it after the timer (this avoids flickering where sometimes the ground has no contact for couple mil seconds)
                    if (this.game) {
                        this.game.time.events.add(this.time[direction][arrayName].get('onEnd'), function () {
                            _this5._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                        });
                    } else {
                        setTimeout(function () {
                            _this5._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                        }, this.time[direction][arrayName].get('onEnd'));
                    }
                } else {
                    this._splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName);
                }
                return true; // this should be inside the (index > -1) check to make sure it was removed but most likely is accurate this way, too. It has been moved here to make onBegin time delays accurate
            }
            return false;
        }
    }, {
        key: '_push',
        value: function _push(bodyA, bodyB, shapeA, shapeB, equation, direction, arrayName) {
            this.shapeCont[direction][arrayName].push(shapeB);
            // functions to execute
            var pushEventFunction = this.pushEventFunctions.get(direction);
            if (pushEventFunction) {
                pushEventFunction(bodyA, bodyB, shapeA, shapeB, equation, this.shapeCont[direction][arrayName], direction, arrayName);
            }
        }
    }, {
        key: '_splice',
        value: function _splice(bodyA, bodyB, shapeA, shapeB, direction, arrayName) {
            var index = this.shapeCont[direction][arrayName].indexOf(shapeB);
            if (index > -1) {
                this.shapeCont[direction][arrayName].splice(index, 1);
                // functions to execute
                var spliceEventFunction = this.spliceEventFunctions.get(direction);
                if (spliceEventFunction) {
                    spliceEventFunction(bodyA, bodyB, shapeA, shapeB, this.shapeCont[direction][arrayName], direction, arrayName);
                }
            }
        }
    }]);

    return MasterOnContact;
})();
/***************************************************************
 *
 *
 *  2016 Silvan Strübi, http://shoga9team.com
 *
 ***************************************************************/
/*jshint esnext: true */

// !!! IMPORTANT !!! [NOTE:] body gets an onEndContact event when fallen asleep, if body allowSleep not deactivated. Prevent this by setting: "this.entity.body.allowSleep = false;" or use NarrowphaseOnContact

// This Helper basically keeps objects - included onBeginContact and excluded after onEndContact, this way you can know when a contact is existent.
// It gives the option to define custom logic when an object gets added and what to execute on adding and removing
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var OnContact = (function (_MasterOnContact) {
	// minPointContact defines the point from where a contact is confirmed

	function OnContact(game, parent) {
		var _this = this;

		var minPointContact = arguments[2] === undefined ? 0 : arguments[2];

		_classCallCheck(this, OnContact);

		_get(Object.getPrototypeOf(OnContact.prototype), 'constructor', this).call(this, game, parent);

		this.name = 'OnContact';
		// this.minPointContact is only for use for functions declared directly here, else the scope should be where this gets created by adding arrow functions
		this.minPointContact = minPointContact;
		// time defines different time handling on how to delay the splice (when to release the shape), realtime is set as default with "0"
		// presets objects and map, which can be overwritten by this.time / also use this to add tracking delays if needed [NOTE:] onBegin must always be smaller or equal than onEnd!
		this.time = {
			top: {},
			right: {},
			bottom: {
				delayed: new Map([['onBegin', 0], ['onEnd', 1050]])
			},
			left: {},
			on: {}
		};
		// functions must be represented by an object with the same key inside this.time to take effect and vice versa to validate entry into shapeCont
		this.pushCheckFunctions = new Map([['top', function (bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation) {
			return equation[0].contactPointA[1] > _this.minPointContact;
		}], ['right', function (bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation) {
			return equation[0].contactPointA[0] < -_this.minPointContact;
		}], ['bottom', function (bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation) {
			return equation[0].contactPointA[1] < -_this.minPointContact;
		}], ['left', function (bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation) {
			return equation[0].contactPointA[0] > _this.minPointContact;
		}], ['on', function (bodyA, bodyB, shapeA, shapeB, shapeB_material_name, equation) {
			return true;
		}]]);
		// functions must be represented by an object with the same key inside this.time to take effect
		this.pushEventFunctions = new Map([['top', function (bodyA, bodyB, shapeA, shapeB, equation, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);
		}], ['right', function (bodyA, bodyB, shapeA, shapeB, equation, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);
		}], ['bottom', function (bodyA, bodyB, shapeA, shapeB, equation, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);
		}], ['left', function (bodyA, bodyB, shapeA, shapeB, equation, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);
		}], ['on', function (bodyA, bodyB, shapeA, shapeB, equation, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - pushed - ' + arrayName);
		}]]);
		// functions must be represented by an object with the same key inside this.time to take effect
		this.spliceEventFunctions = new Map([['top', function (bodyA, bodyB, shapeA, shapeB, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);
		}], ['right', function (bodyA, bodyB, shapeA, shapeB, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);
		}], ['bottom', function (bodyA, bodyB, shapeA, shapeB, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);
		}], ['left', function (bodyA, bodyB, shapeA, shapeB, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);
		}], ['on', function (bodyA, bodyB, shapeA, shapeB, array, direction, arrayName) {
			console.log(direction + ' - id: ' + shapeB.id + ' - spliced - ' + arrayName);
		}]]);
	}

	_inherits(OnContact, _MasterOnContact);

	_createClass(OnContact, [{
		key: 'setSpecialCollisionResponse',

		// INDEPENTENT FROM FUNCTIONS ABOVE! But convenient to use in conjunction with check functions, use this to set special properties to shapes
		// noCollisionResponses handling
		value: function setSpecialCollisionResponse(map, body, shape) {
			if (map === undefined) map = new Map([['active', true], ['AI', function () {
				return parent._aiActive;
			}]]);
			var collision = arguments[3] === undefined ? true : arguments[3];
			var equation = arguments[4] === undefined ? true : arguments[4];

			if (!collision) {
				if (equation) {
					// collisionResponse = false has no collision but onBeginContact still receives an equation
					shape.collisionResponse = false;
				} else {
					// sensor = true has no collision and onBeginContact does only receive the contact without equation
					shape.sensor = true;
				}
			}
			shape.sst_parent = body;
			return shape.sst_type = map;
		}
	}]);

	return OnContact;
})(MasterOnContact);