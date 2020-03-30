'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_array = require("bs-platform/lib/js/caml_array.js");

var initialState = {
  visibleInputs: 1,
  calculating: false
};

function reducer(state, action) {
  if (action !== 0) {
    return state;
  } else {
    return {
            visibleInputs: state.visibleInputs + 1 | 0,
            calculating: state.calculating
          };
  }
}

function createInput(dispatch) {
  return Curry._1(dispatch, /* AddNewInput */0);
}

function DestinationInputs(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  return React.createElement("form", undefined, Caml_array.caml_make_vect(match[0].visibleInputs, React.createElement("input", {
                      type: "text"
                    })), React.createElement("button", {
                  onClick: (function ($$event) {
                      $$event.preventDefault();
                      return Curry._1(dispatch, /* AddNewInput */0);
                    })
                }, "Next destination"), React.createElement("button", {
                  role: "submit"
                }, "Calculate Distance"));
}

var make = DestinationInputs;

exports.initialState = initialState;
exports.reducer = reducer;
exports.createInput = createInput;
exports.make = make;
/* react Not a pure module */
