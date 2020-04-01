'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var TotalDistance$ReasonReactExamples = require("./TotalDistance.bs.js");
var DestinationInputs$ReasonReactExamples = require("./DestinationInputs.bs.js");

var wrapperStyles = {
  display: "flex",
  justifyContent: "space-around"
};

var buttonStyles = {
  marginTop: ".35rem"
};

var initialState = {
  visibleInputs: 1,
  calculations: 0,
  lastStartingPoint: "",
  lastDestination: "",
  totalDistance: 0.0
};

function reducer(state, action) {
  if (typeof action === "number") {
    switch (action) {
      case /* AddNewInput */0 :
          return {
                  visibleInputs: state.visibleInputs + 1 | 0,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance
                };
      case /* RemoveInput */1 :
          return state;
      case /* CalculateDistance */2 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations + 1 | 0,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance
                };
      
    }
  } else {
    switch (action.tag | 0) {
      case /* UpdateLastStartingPoint */0 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: action[0].target.value,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance
                };
      case /* UpdateLastDestination */1 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: action[0].target.value,
                  totalDistance: state.totalDistance
                };
      case /* IncreaseTotalDistance */2 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance + action[0]
                };
      
    }
  }
}

function calculateDistanceThenCreateNewInput(dispatch) {
  Curry._1(dispatch, /* AddNewInput */0);
  return Curry._1(dispatch, /* CalculateDistance */2);
}

function handleLastStartingPointChange($$event, dispatch) {
  $$event.persist();
  return Curry._1(dispatch, /* UpdateLastStartingPoint */Block.__(0, [$$event]));
}

function handleLastDestinationChange($$event, dispatch) {
  $$event.persist();
  return Curry._1(dispatch, /* UpdateLastDestination */Block.__(1, [$$event]));
}

function App(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var distanceMatrixFullUrl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + (state.lastStartingPoint + ("&destinations=" + (state.lastDestination + "&units=imperial&key=AIzaSyDYDdl-3dUk1H59jTBcFU9KAd3UesUR9qE")));
          fetch(distanceMatrixFullUrl).then((function (response) {
                      return response.json();
                    })).then((function (jsonResponse) {
                    var distance = ((jsonResponse.rows.length && jsonResponse.rows[0].elements[0].distance.text) || "0");
                    ((console.log("AYO", distance)));
                    Curry._1(dispatch, /* IncreaseTotalDistance */Block.__(2, [Caml_format.caml_float_of_string(List.hd($$String.split_on_char(/* " " */32, distance)))]));
                    console.log(jsonResponse);
                    return Promise.resolve(/* () */0);
                  })).catch((function (_err) {
                  console.log(_err);
                  return Promise.resolve(/* () */0);
                }));
          return ;
        }), [state.calculations]);
  return React.createElement("div", {
              style: wrapperStyles
            }, React.createElement("form", undefined, Caml_array.caml_make_vect(state.visibleInputs, React.createElement(DestinationInputs$ReasonReactExamples.make, {
                          handleLastStartingPointChange: handleLastStartingPointChange,
                          handleLastDestinationChange: handleLastDestinationChange,
                          dispatch: dispatch
                        })), React.createElement("button", {
                      style: buttonStyles,
                      onClick: (function ($$event) {
                          $$event.preventDefault();
                          Curry._1(dispatch, /* AddNewInput */0);
                          return Curry._1(dispatch, /* CalculateDistance */2);
                        })
                    }, "Next destination")), React.createElement(TotalDistance$ReasonReactExamples.make, {
                  distance: Pervasives.string_of_float(state.totalDistance)
                }));
}

var make = App;

exports.wrapperStyles = wrapperStyles;
exports.buttonStyles = buttonStyles;
exports.initialState = initialState;
exports.reducer = reducer;
exports.calculateDistanceThenCreateNewInput = calculateDistanceThenCreateNewInput;
exports.handleLastStartingPointChange = handleLastStartingPointChange;
exports.handleLastDestinationChange = handleLastDestinationChange;
exports.make = make;
/* react Not a pure module */
