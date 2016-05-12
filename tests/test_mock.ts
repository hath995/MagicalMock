/// <reference path="../typings/main.d.ts" />
import {Mock} from '../src/mock';
import {expect} from 'chai';

describe("Mock", () => {
  it("Should be callable, and return a new mock", () => {
    let mock = new Mock();
    let result = mock();
    console.log(result);
    expect(result).to.be.instanceof(Mock);
  }) 

  it("Should allow setting return value", () => {
    let mock = new Mock();
    mock.return_value = true;
    let result = mock();
    expect(result).to.be.true;

    let mock2 = new Mock();
    mock2.return_value = undefined;
    let result2 = mock2();
    expect(result2).to.be.undefined;
  });

  it("Should count function calls", () => {
    let mock = new Mock();
    mock.return_value = true;
    expect(mock.called).to.be.false
    expect(mock.call_count).to.equal(0);
    mock();
    mock();
    expect(mock.called).to.be.true
    expect(mock.call_count).to.equal(2);
  });

  it("Should list arguments that were called with", () => {
    let mock = new Mock();
    mock.return_value = true;
    expect(mock.call_args).to.be.undefined
    expect(mock.call_args_list).to.deep.equal([]);
    mock(1,2);
    mock("a","b");
    expect(mock.call_args).to.deep.equal(["a","b"])
    expect(mock.call_args_list).to.deep.equal([[1,2],["a","b"]]);
  });

  it("Should identify as a mock", () => {
       let mock = new Mock();
       expect(mock instanceof Mock).to.be.true;
  });

  it("Should return a mock for new properties", () => {
       let mock = new Mock();
       expect(mock.a).to.be.instanceof(Mock);
  });

  it("Should return a value for a set property", () => {
      let mock = new Mock();
      mock.a = true;
      mock.b = 2;
      mock.c.d = 3
      expect(mock.a).to.be.true;
      expect(mock.b).to.equal(2);
      expect(mock.c.d).to.equal(3);
  });
})
