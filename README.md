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
* [ `call_count`](#call_count)
* [ `call_args`](#call_args)
* [ `call_args_list`](#call_args_list)
* [ `return_value`](#return_value)
* [ `side_effect`](#side_effect)
* [ `spec`](#spec)
* [ `constructs`](#constructs)
* [ `yields`](#yields)

### Methods
* [`assert_called_with`](#assert_called_with)
* [ `assert_called_once_with`](#assert_called_once_with)
* [ `assert_any_call` ](#assert_any_call)
* [ `assert_has_calls`](#assert_has_calls)
* [ `assert_not_called`](#assert_not_called)

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
### call_count
An integer count of the number of times the mock object has been called as a function.

__Examples__

```js
    let mock = new Mock();
    mock();
    mock();
    console.log(mock.call_count); //2
```

---------------------------------------

## Methods
