

class Mock {

    constructor() {
        let mockfn = function() {};
        mockfn.called = false;
        mockfn.call_count = 0;
        let unset = Symbol("undefined");
        mockfn.__return_value = unset
        Object.defineProperty(mockfn, "return_value", {
            get: function() {
                if(this.__return_value == unset) {
                    return new Mock();
                }else{
                    return this.__return_value;
                }
            },
            set: function(val) {
                this.__return_value = val;
            }
        });
        mockfn.call_args = undefined;
        mockfn.call_args_list = [];
        mockfn.method_calls = [];
    }
}
