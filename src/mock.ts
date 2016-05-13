
const UNSET = Symbol("undefined");
const RETURN_VALUE = Symbol("return_value");
const SIDE_EFFECT = Symbol("side_effect");
const INSTANCE_TYPE = Symbol("instance_type");
let id = 1;

function setupMockProperties(mockfn) {
  mockfn.called = false;
  mockfn.call_count = 0;
  mockfn.id = id++;
  mockfn[RETURN_VALUE] = UNSET;
  mockfn.call_args = undefined;
  mockfn.call_args_list = [];
  mockfn.method_calls = [];
}

function setupMockGetterSetters(mockfn) {
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
          else if(val[Symbol.iterator]) {
            this[SIDE_EFFECT] = (function*() {yield * val})();
          }else{
            this[SIDE_EFFECT] = (function*() {yield val})();
          }
        }
      });
    Object.defineProperty(mockfn, "spec", {
      set(val) {
        this[INSTANCE_TYPE] = val;
        //instanceof seems to be having a side effect
        //I suspect the __proto__ is being cached
        this instanceof val;
      }
    });
}

let proxy_handler = {
  apply(target, thisObj, args) {
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

  get(target, property) {
    //inspect seems to be a nodejs internal property; removing this test will enable a infinite loop
    if(!(property in target) && property !== 'inspect') {
      target[property] = new Mock();
    }
    return target[property]
  },
  getPrototypeOf(target) {
    if(target[INSTANCE_TYPE]) {
      return target[INSTANCE_TYPE].prototype;
    }else{
      return Mock.prototype;
    }
  },
  setPrototypeOf(target, proto) {
    //I might change my mind about this
    //another reasonable thing to do would be
    //setting target[INSTANCE_TYPE] = proto
    throw new Error('Changing the prototype is forbidden; Use spec instead');
  }
};

export class Mock {

  constructor() {
    let mockfn = function() {};
    setupMockProperties(mockfn);
    setupMockGetterSetters(mockfn);

    let proxy_obj = new Proxy(mockfn, proxy_handler);
    return proxy_obj;
    }
  }
