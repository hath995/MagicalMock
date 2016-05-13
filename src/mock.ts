
const UNSET = Symbol("undefined");
const RETURN_VALUE = Symbol("return_value");
const SIDE_EFFECT = Symbol("side_effect");
let id = 1;
export class Mock {

    constructor() {
        let mockfn = function() {};


        mockfn.called = false;
        mockfn.call_count = 0;
        mockfn.id = id++;
        mockfn[RETURN_VALUE] = UNSET
        Object.defineProperty(mockfn, "return_value", {
            get() {
                if(this[RETURN_VALUE] == UNSET) {
                    return new Mock();
                }else{
                    return this[RETURN_VALUE];
                }
            },
            set(val) {
                this[RETURN_VALUE] = val;
            }
        });
        Object.defineProperty(mockfn, "side_effect", {
            get() {
                return this[SIDE_EFFECT];
            },
            set(val) {
                if(val instanceof Function) {
                    this[SIDE_EFFECT] = val;
                else if(Array.isArray(val)) {
                    this[SIDE_EFFECT] = (function*() {yield * val})();
                }else{
                    this[SIDE_EFFECT] = (function*() {yield val})();
                }
            }
        });
        mockfn.call_args = undefined;
        mockfn.call_args_list = [];
        mockfn.method_calls = [];

        let handler = {
            apply: function(target, thisObj, args) {
                target.called = true;
                target.call_count++;
                target.call_args = args;
                target.call_args_list.push(args);
                if(target[SIDE_EFFECT]) {
                    if(target[SIDE_EFFECT] instanceof Function) {
                        return target[SIDE_EFFECT](...args)
                    }
                    let {value, done} = target[SIDE_EFFECT].next();
                    if(done) {
                        throw Error("Side effect iteration ended");
                    }
                    if(value instanceof Error) {
                        throw value;
                    }
                    return value;
                }
                return target.return_value;
            },

            get: function(target, property) {
                //inspect seems to be a nodejs internal property; removing this test will enable a infinite loop
                if(!(property in target) && property !== 'inspect') {
                    target[property] = new Mock();
                }
                return target[property]
            },
            getPrototypeOf: function(target) {
                return Mock.prototype
            }

        };
        let proxy_obj = new Proxy(mockfn, handler);


        return proxy_obj;
    }
}
