'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var TotalDistance$ReasonReactExamples = require("../TotalDistance.bs.js");

var wrapperStyles = {
  display: "flex",
  justifyContent: "space-around"
};

var initialState = {
  visibleInputs: 1,
  calculations: 0,
  lastStartingPoint: "",
  lastDestination: ""
};

function reducer(state, action) {
  if (typeof action === "number") {
    switch (action) {
      case /* AddNewInput */0 :
          return {
                  visibleInputs: state.visibleInputs + 1 | 0,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination
                };
      case /* RemoveInput */1 :
          return state;
      case /* CalculateDistance */2 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations + 1 | 0,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination
                };
      
    }
  } else if (action.tag) {
    return {
            visibleInputs: state.visibleInputs,
            calculations: state.calculations,
            lastStartingPoint: state.lastStartingPoint,
            lastDestination: action[0].target.value
          };
  } else {
    return {
            visibleInputs: state.visibleInputs,
            calculations: state.calculations,
            lastStartingPoint: action[0].target.value,
            lastDestination: state.lastDestination
          };
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

function DestinationInputs(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var distanceMatrixFullUrl = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + (state.lastStartingPoint + ("&destinations=" + (state.lastDestination + "&units=imperial&key=AIzaSyDYDdl-3dUk1H59jTBcFU9KAd3UesUR9qE")));
          fetch(distanceMatrixFullUrl).then((function (response) {
                      return response.json();
                    })).then((function (jsonResponse) {
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
            }, React.createElement("form", undefined, Caml_array.caml_make_vect(state.visibleInputs, React.createElement("div", undefined, React.createElement("label", undefined, "From:", React.createElement("input", {
                                  className: "from",
                                  type: "text",
                                  onChange: (function ($$event) {
                                      return handleLastStartingPointChange($$event, dispatch);
                                    })
                                })), React.createElement("label", undefined, "To:", React.createElement("input", {
                                  className: "to",
                                  type: "text",
                                  onChange: (function ($$event) {
                                      return handleLastDestinationChange($$event, dispatch);
                                    })
                                })))), React.createElement("button", {
                      onClick: (function ($$event) {
                          $$event.preventDefault();
                          Curry._1(dispatch, /* AddNewInput */0);
                          return Curry._1(dispatch, /* CalculateDistance */2);
                        })
                    }, "Next destination")), React.createElement(TotalDistance$ReasonReactExamples.make, {
                  totalDistance: "0"
                }));
}

var make = DestinationInputs;

exports.wrapperStyles = wrapperStyles;
exports.initialState = initialState;
exports.reducer = reducer;
exports.calculateDistanceThenCreateNewInput = calculateDistanceThenCreateNewInput;
exports.handleLastStartingPointChange = handleLastStartingPointChange;
exports.handleLastDestinationChange = handleLastDestinationChange;
exports.make = make;
/* react Not a pure module */
