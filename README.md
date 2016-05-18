# MagicalMock

MagicalMock is a convenience class for simplify creation of mock objects and functions for testing purposes. This package is a port of the python unittest.mock, with additional features for JavaScript.

## Install

```sh
npm i --save-dev magical-mock
```

## Requirements
This library relies on heavily on ES6 Proxies, and so either a recent version of Node or the browsers will be required

## Documentation

### Properties
* [`called`](#called)
* [`call_count`](#call_count)
* [`call_args`](#call_args)
* [`call_args_list`](#call_args_list)
* [`return_value`](#return_value)
* [`side_effect`](#side_effect)
* [`spec`](#spec)
* [`constructs`](#constructs)
* [`yields`](#yields)

### Methods
* [`assert_called_with`](#assert_called_with)
* [`assert_called_once_with`](#assert_called_once_with)
* [`assert_any_call`](#assert_any_call)
* [`assert_has_calls`](#assert_has_calls)
* [`assert_not_called`](#assert_not_called)

## Properties

<a name="called"></a>
### called

A boolean value which is set to true if the mock object is used as a function and called.

__Examples__

```js
    let mock = new Mock();
    console.log(mock.called) //false
    mock();
    console.log(mock.called) //true
```

---------------------------------------
<a name="call_count"></a>
### call\_count

An integer count of the number of times the mock object has been called as a function.

__Examples__

```js
    let mock = new Mock();
    mock();
    mock();
    console.log(mock.call_count); //2
```

---------------------------------------
<a name="call_args"></a>
### call\_args

A list of the arguments last used when calling the mock object as a function.

__Examples__

```js
    let mock = new Mock();
    mock(1,2);
    console.log(mock.call_args); //[1,2]
```
---------------------------------------
<a name="call_args_list"></a>
### call\_args\_list

A list of argument lists of the arguments used when calling the mock object as a function.

__Examples__

```js
    let mock = new Mock();
    mock(1,2);
    mock(3,4);
    console.log(mock.call_args_list); //[[1,2], [3,4]
```
---------------------------------------
<a name="return_value"></a>
### return\_value

Calling a mock object as a function by default returns another mock object. However, by assigning return\_value to a value the mock will return that value instead.

__Examples__

```js
    let mock = new Mock();
    mock.return_value = 4;
    console.log(mock()) //4
```
---------------------------------------
<a name="side_effect"></a>
### side\_effect

Side\_effect allows the function to return successive values, throw errors, or substitute your own function for calling the mock as a function.

__Examples__

```js
    let mock = new Mock();
    mock.side_effect = [1,2,Error("Problems occurred")];
    mock() //1
    mock() //2
    mock() //throw Error("Problems occurred")

    let mock2 = new Mock();
    mock2.side_effect = function(input) {
        if(input == 1) {
            return "foo";
        }else if(input == 2) {
            return "bar";
        }else{
            return "baz";
        }
    }
    mock2(1) //foo
    mock2(2) //bar
    mock2(3) //baz

    let mock3 = new Mock();
    mock3.side_effect = RangeError("Mock has gone too far");
    mock3() //throws RangeError
```
---------------------------------------
<a name="spec"></a>
### spec

Spec allows the mock to be assigned a prototype

__Examples__

```js
    class Foo {};
    let mock = new Mock();
    mock.spec = Foo;
    mock instanceof Foo //true
```
---------------------------------------
<a name="constructs"></a>
### constructs

If you would like to use a mock as a contructor function you can specify what it will create.

__Examples__

```js
    let mock = Mock();
    mock.constructs = {x: 1, y: 2};
    let result = new mock(); //{x: 1, y: 2}
```
---------------------------------------
<a name="yields"></a>
### yields

If you would like to use a mock in a context as an iterator you can specify a value, or series of values, or an error to throw. If a generator function is provided instead then it will use that.

__Examples__

```js
    let mock = new Mock();
    mock.yields = [1,2, Error("explosion")]
    for(let item of mock) {
        console.log(item);
    }
    //1
    //2
    //throws Error("foo")

    let mock2 = new Mock();
    mock2.yields = function* () { yield * [1,2] }
    for(let item of mock2) {
        console.log(item);
    }
    //1
    //2
```
---------------------------------------

## Methods

<a name="assert_called_with"></a>
### assert\_called\_with(...args)


