
const UNSET = Symbol("undefined");
const RETURN_VALUE = Symbol("return_value");
const SIDE_EFFECT = Symbol("side_effect");
const INSTANCE_TYPE = Symbol("instance_type");
const CONSTRUCTOR_VALUE = Symbol("constructor_value");
let id = 1;

function setupMockProperties(mockfn) {
  mockfn.called = false;
  mockfn.call_count = 0;
  mockfn.id = id++;
  mockfn[RETURN_VALUE] = UNSET;
  mockfn[CONSTRUCTOR_VALUE] = UNSET;
  mockfn.call_args = undefined;
  mockfn.call_args_list = [];
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
            }else if(val[Symbol.iterator]) {
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
    Object.defineProperty(mockfn, "constructs", {
      set(val) {
        this[CONSTRUCTOR_VALUE] = val;
      }
    });
    Object.defineProperty(mockfn, "yields", {
      set(val) {
        if(val instanceof Function) {
          this[Symbol.iterator] = val;
        } else if(val[Symbol.iterator]) {
          this[Symbol.iterator] = function*() {
            for(let item of val[Symbol.iterator]()) {
              if(item instanceof Error) {
                throw item;
              }
              yield item;
            }
          };
        }else{
          this[Symbol.iterator] = function*() {
            if(val instanceof Error) {
              throw val;
            }
            yield val
          };
        }
      }
    });
}

let mock_methods = {
  assert_called_with(...args) {
    this.call_args.forEach((elem, index) => {
      if(args[index] !== elem) {
        throw new Error("Mock called with different parameters")
      }
    });
  },
  assert_called_once_with(...args) {
    if(this.call_count !== 1) {
      throw new Error("Mock not called");
    }
    this.call_args.forEach((elem, index) => {
      if(args[index] !== elem) {
        throw new Error("Mock called with different parameters")
      }
    });
  },
  assert_any_call(...args) {
    let has_call = this.call_args_list.some((arg_list) => {
      return args.reduce((memo, current, index) => {
        return memo && current === arg_list[index];
      }, true)
    });
    if(!has_call) {
      throw Error("Mock was not called with specified parameters")
    }
  },
  assert_has_calls(calls, any_order=false) {
    let matching = true;
    if(!any_order) {
      let start = this.call_args_list.findIndex((arg_list) => {
        if(calls.length === 0) {
          return false
        }
        return calls[0].reduce((memo, current, index) => {
          return memo && current === arg_list[index];
        }, true);
      });
      for(let i = 0; i < calls.length; i++) {
        matching = matching && this.call_args_list[start + i].reduce((memo, current, index) => {
          return memo && current == calls[i][index];
        }, true);
      }
    }else{
      matching = false;
      //slow
      matching = calls.every((call) => {
        return this.call_args_list.some((arg_list) => {
          return call.reduce((memo, current, index) => {
            return memo && current === arg_list[index];
          });
        });
      });
    }

    if(!matching) {
      throw new Error("Mock was not called with all expected calls");
    }
  },
  assert_not_called() {
    if(this.call_count !== 0) {
      throw new Error("Mock was called")
    }
  },
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
  },
  construct(target, argumentList, newTarget) {
    if(target[CONSTRUCTOR_VALUE] === UNSET) {
      return new Mock();
    }else{
      return target[CONSTRUCTOR_VALUE];
    }
  }
};

function setupMockMethods(mockfn) {
  for(let method in mock_methods) {
    mockfn[method] = mock_methods[method];
  }
}
 
export class Mock {

  constructor() {
    let mockfn = function() {};
    setupMockProperties(mockfn);
    setupMockGetterSetters(mockfn);
    setupMockMethods(mockfn);

    let proxy_obj = new Proxy(mockfn, proxy_handler);
    return proxy_obj;
    }
  }
