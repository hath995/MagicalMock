"use strict";
/// <reference path="../typings/main.d.ts" />
const mock_1 = require('../src/mock');
const chai_1 = require('chai');
describe("Mock", () => {
    it("Should be callable, and return a new mock", () => {
        let mock = new mock_1.Mock();
        let result = mock();
        chai_1.expect(result).to.be.instanceof(mock_1.Mock);
    });
    it("Should allow setting return value", () => {
        let mock = new mock_1.Mock();
        mock.return_value = true;
        let result = mock();
        chai_1.expect(result).to.be.true;
        let mock2 = new mock_1.Mock();
        mock2.return_value = undefined;
        let result2 = mock2();
        chai_1.expect(result2).to.be.undefined;
    });
    it("Should count function calls", () => {
        let mock = new mock_1.Mock();
        mock.return_value = true;
        chai_1.expect(mock.called).to.be.false;
        chai_1.expect(mock.call_count).to.equal(0);
        mock();
        mock();
        chai_1.expect(mock.called).to.be.true;
        chai_1.expect(mock.call_count).to.equal(2);
    });
    it("Should list arguments that were called with", () => {
        let mock = new mock_1.Mock();
        mock.return_value = true;
        chai_1.expect(mock.call_args).to.be.undefined;
        chai_1.expect(mock.call_args_list).to.deep.equal([]);
        mock(1, 2);
        mock("a", "b");
        chai_1.expect(mock.call_args).to.deep.equal(["a", "b"]);
        chai_1.expect(mock.call_args_list).to.deep.equal([[1, 2], ["a", "b"]]);
    });
    it("Should identify as a mock", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(mock instanceof mock_1.Mock).to.be.true;
    });
    it("Should return a mock for new properties", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(mock.a).to.be.instanceof(mock_1.Mock);
    });
    it("Should return a value for a set property", () => {
        let mock = new mock_1.Mock();
        mock.a = true;
        mock.b = 2;
        mock.c.d.e = 3;
        mock.f.g.h.return_value = false;
        mock.h = [1, 2, 3];
        chai_1.expect(mock.a).to.be.true;
        chai_1.expect(mock.b).to.equal(2);
        chai_1.expect(mock.c.d.e).to.equal(3);
        chai_1.expect(mock.f.g.h()).to.be.false;
        chai_1.expect(mock.h).to.deep.equal([1, 2, 3]);
    });
    it("Should return a series of different values when given an array return value", () => {
        let mock = new mock_1.Mock();
        mock.side_effect = [1, 2, 3];
        chai_1.expect(mock.side_effect.next).to.be.instanceof(Function);
        chai_1.expect(mock()).to.equal(1);
        chai_1.expect(mock()).to.equal(2);
        chai_1.expect(mock()).to.equal(3);
    });
    it("Should return a series of different values when given an interator", () => {
        let mock2 = new mock_1.Mock();
        mock2.side_effect = (function* () { yield* [1, 2, 3]; })();
        chai_1.expect(mock2()).to.equal(1);
        chai_1.expect(mock2()).to.equal(2);
        chai_1.expect(mock2()).to.equal(3);
    });
    it("Should raise an exception when given a side_effect", () => {
        let mock = new mock_1.Mock();
        mock.side_effect = RangeError("Mock has gone too far!");
        chai_1.expect(() => mock()).to.throw(RangeError);
    });
    it("Should throw an error at end of the side_effect", () => {
        let mock = new mock_1.Mock();
        mock.side_effect = [1];
        chai_1.expect(mock()).to.equal(1);
        chai_1.expect(() => mock()).to.throw(Error);
    });
    it("Should call a function as a side_effect if given", () => {
        let mock = new mock_1.Mock();
        mock.side_effect = (x, y) => x + y;
        chai_1.expect(mock(1, 2)).to.equal(3);
    });
    it("Should pretend to be another class", () => {
        function Foo() { }
        let mock = new mock_1.Mock();
        mock.spec = Foo;
        chai_1.expect(mock instanceof Foo).to.be.true;
        chai_1.expect(mock instanceof mock_1.Mock).to.be.false;
        chai_1.expect(() => mock.__proto__ = Foo).to.throw(Error);
    });
    it("Should throw an error if assert_called_with arguments do not match last call", () => {
        let mock = new mock_1.Mock();
        mock();
        mock(1, 2, 3);
        chai_1.expect(() => mock.assert_called_with(1, 2, 3)).to.not.throw(Error);
        chai_1.expect(() => mock.assert_called_with()).to.throw(Error);
    });
    it("Should throw an error if assert_called_once_with if the function has not been called", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_called_once_with(1, 2)).to.throw(Error);
    });
    it("Should throw an error if assert_called_once_with if the function has not been called", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_called_once_with(1, 2)).to.throw(Error);
    });
    it("Should not throw an error if assert_called_once_with if the function has been called", () => {
        let mock = new mock_1.Mock();
        mock(1, 2);
        chai_1.expect(() => mock.assert_called_once_with(2, 3)).to.throw(Error);
        chai_1.expect(() => mock.assert_called_once_with(1, 2)).to.not.throw(Error);
    });
    it("Should throw an error is assert_not_called when it has been called", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_not_called()).to.not.throw(Error);
        chai_1.expect(() => (mock(), mock.assert_not_called())).to.throw(Error);
    });
    it("Should throw an error if not called or not called with arguments for assert_any_call", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_any_call()).to.throw(Error);
        mock();
        chai_1.expect(() => mock.assert_any_call()).to.not.throw(Error);
        chai_1.expect(() => mock.assert_any_call(1, 2, 3)).to.throw(Error);
    });
    it("Should throw an error if not called with specified parameters at any point", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_any_call()).to.throw(Error);
        chai_1.expect(() => mock.assert_any_call(1, 2, 3)).to.throw(Error);
        mock();
        chai_1.expect(() => mock.assert_any_call()).to.not.throw(Error);
        chai_1.expect(() => mock.assert_any_call(1, 2, 3)).to.throw(Error);
        mock(1, 2, 3);
        mock(3, 4, 5);
        chai_1.expect(() => mock.assert_any_call(1, 2, 3)).to.not.throw(Error);
    });
    it("Should throw an error if assert_has_calls does not have calls that were called in order", () => {
        let mock = new mock_1.Mock();
        chai_1.expect(() => mock.assert_has_calls([])).to.not.throw(Error);
        mock();
        chai_1.expect(() => mock.assert_has_calls([])).to.not.throw(Error);
        chai_1.expect(() => mock.assert_has_calls([[], [1, 2, 3]])).to.throw(Error);
        mock(1, 2, 3);
        chai_1.expect(() => mock.assert_has_calls([[], [1, 2, 3]])).to.not.throw(Error);
        let mock2 = new mock_1.Mock();
        mock(1, 2);
        mock(3, 4);
        mock(4, 5);
        chai_1.expect(() => mock.assert_has_calls([[3, 4], [4, 5]])).to.not.throw(Error);
        chai_1.expect(() => mock.assert_has_calls([[1, 2], [4, 5]])).to.throw(Error);
    });
    it("Should throw an error if assert_has_calls does not have calls that were called in any order", () => {
        let mock = new mock_1.Mock();
        mock(1, 2);
        mock(3, 4);
        mock(4, 5);
        chai_1.expect(() => mock.assert_has_calls([[3, 4], [4, 5]], true)).to.not.throw(Error);
        chai_1.expect(() => mock.assert_has_calls([[1, 2], [4, 5]], true)).to.not.throw(Error);
        chai_1.expect(() => mock.assert_has_calls([[4, 6], [4, 5]], true)).to.throw(Error);
    });
    it("Should return a mock if used as a constructor", () => {
        let mock = new mock_1.Mock();
        let res = new mock();
        chai_1.expect(res).to.be.instanceof(mock_1.Mock);
    });
    it("Should return a specified value if used as a constructor", () => {
        let mock = new mock_1.Mock();
        mock.constructs = { x: 4 };
        chai_1.expect(new mock()).to.deep.equal({ x: 4 });
    });
    it("Should yield a single value", () => {
        let mock = new mock_1.Mock();
        mock.yields = 4;
        let values = [];
        for (let item of mock) {
            values.push(item);
        }
        chai_1.expect(values).to.deep.equal([4]);
    });
    it("Should throw an exception if given an exception to yield", () => {
        let mock = new mock_1.Mock();
        mock.yields = Error("test");
        let values = [];
        chai_1.expect(() => {
            for (let item of mock) {
                values.push(item);
            }
        }).to.throw(Error);
        chai_1.expect(values).to.deep.equal([]);
        mock.yields = [1, Error("test")];
        values = [];
        chai_1.expect(() => {
            for (let item of mock) {
                values.push(item);
            }
        }).to.throw(Error);
        chai_1.expect(values).to.deep.equal([1]);
    });
    it("Should yield multiple values", () => {
        let mock = new mock_1.Mock();
        mock.yields = [1, 2, 3];
        let values = [];
        for (let item of mock) {
            values.push(item);
        }
        chai_1.expect(values).to.deep.equal([1, 2, 3]);
    });
    it("Should yield values from a generator function", () => {
        let mock = new mock_1.Mock();
        mock.yields = function* () { yield* [1, 2, 3]; };
        let values = [];
        for (let item of mock) {
            values.push(item);
        }
        chai_1.expect(values).to.deep.equal([1, 2, 3]);
    });
});
//# sourceMappingURL=test_mock.js.map