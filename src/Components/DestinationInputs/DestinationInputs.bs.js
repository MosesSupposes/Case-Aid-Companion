'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_array = require("bs-platform/lib/js/caml_array.js");

var initialState = {
  visibleInputs: 1,
  calculating: false,
  lastStartingPoint: "",
  lastDestination: ""
};

function reducer(state, action) {
  switch (action) {
    case /* AddNewInput */0 :
        return {
                visibleInputs: state.visibleInputs + 1 | 0,
                calculating: state.calculating,
                lastStartingPoint: state.lastStartingPoint,
                lastDestination: state.lastDestination
              };
    case /* RemoveInput */1 :
        return state;
    case /* CalculateDistance */2 :
        return {
                visibleInputs: state.visibleInputs,
                calculating: !state.calculating,
                lastStartingPoint: state.lastStartingPoint,
                lastDestination: state.lastDestination
              };
    
  }
}

function calculateDistanceThenCreateNewInput(dispatch) {
  Curry._1(dispatch, /* AddNewInput */0);
  return Curry._1(dispatch, /* CalculateDistance */2);
}

function DestinationInputs(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var allStartingPoints = (document.querySelectorAll(".from"));
          var allDestinations = (document.querySelectorAll(".to"));
          var lastStartingPoint = Caml_array.caml_array_get(allStartingPoints, allStartingPoints.length - 1 | 0);
          var lastDestination = Caml_array.caml_array_get(allDestinations, allDestinations.length - 1 | 0);
          console.log(lastStartingPoint);
          console.log(lastDestination);
          fetch("https://dog.ceo/api/breeds/image/random/3").then((function (response) {
                      return response.json();
                    })).then((function (jsonResponse) {
                    return Promise.resolve(/* () */0);
                  })).catch((function (_err) {
                  return Promise.resolve(/* () */0);
                }));
          return ;
        }), [state.calculating]);
  return React.createElement("form", undefined, Caml_array.caml_make_vect(state.visibleInputs, React.createElement("div", undefined, React.createElement("label", undefined, "From:", React.createElement("input", {
                              className: "from",
                              type: "text"
                            })), React.createElement("label", undefined, "To:", React.createElement("input", {
                              className: "to",
                              type: "text"
                            })))), React.createElement("button", {
                  onClick: (function ($$event) {
                      $$event.preventDefault();
                      Curry._1(dispatch, /* AddNewInput */0);
                      return Curry._1(dispatch, /* CalculateDistance */2);
                    })
                }, "Next destination"));
}

var make = DestinationInputs;

exports.initialState = initialState;
exports.reducer = reducer;
exports.calculateDistanceThenCreateNewInput = calculateDistanceThenCreateNewInput;
exports.make = make;
/* react Not a pure module */
