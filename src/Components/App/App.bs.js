'use strict';

var List = require("bs-platform/lib/js/list.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Stack = require("bs-platform/lib/js/stack.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var UndoButton$ReasonReactExamples = require("../UndoButton/UndoButton.bs.js");
var TotalDistance$ReasonReactExamples = require("../TotalDistance/TotalDistance.bs.js");
var DestinationInputs$ReasonReactExamples = require("../DestinationInputs/DestinationInputs.bs.js");

var wrapperStyles = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around"
};

var nextDestinationButtonStyles = {
  marginTop: ".35rem"
};

var undoButtonStyles = {
  flexBasis: "100%"
};

var rightSideOfPageStyles = {
  display: "flex",
  alignItems: "flex-end",
  flexDirection: "column"
};

var initialState_everyCalculation = Stack.create(/* () */0);

var initialState = {
  visibleInputs: 1,
  calculations: 0,
  lastStartingPoint: "",
  lastDestination: "",
  totalDistance: 0.0,
  everyCalculation: initialState_everyCalculation
};

function reducer(state, action) {
  if (typeof action === "number") {
    if (action === /* AddNewInput */0) {
      return {
              visibleInputs: state.visibleInputs + 1 | 0,
              calculations: state.calculations,
              lastStartingPoint: state.lastStartingPoint,
              lastDestination: state.lastDestination,
              totalDistance: state.totalDistance,
              everyCalculation: state.everyCalculation
            };
    } else {
      return {
              visibleInputs: state.visibleInputs,
              calculations: state.calculations + 1 | 0,
              lastStartingPoint: state.lastStartingPoint,
              lastDestination: state.lastDestination,
              totalDistance: state.totalDistance,
              everyCalculation: state.everyCalculation
            };
    }
  } else {
    switch (action.tag | 0) {
      case /* RemoveInputAndSubtractFromTotalDistance */0 :
          var match = action[0];
          if (match.tag) {
            return {
                    visibleInputs: state.visibleInputs > 0 ? state.visibleInputs - 1 | 0 : state.visibleInputs,
                    calculations: state.calculations,
                    lastStartingPoint: state.lastStartingPoint,
                    lastDestination: state.lastDestination,
                    totalDistance: state.totalDistance - match[0],
                    everyCalculation: state.everyCalculation
                  };
          } else {
            return state;
          }
      case /* UpdateLastStartingPoint */1 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: action[0].target.value,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance,
                  everyCalculation: state.everyCalculation
                };
      case /* UpdateLastDestination */2 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: action[0].target.value,
                  totalDistance: state.totalDistance,
                  everyCalculation: state.everyCalculation
                };
      case /* IncreaseTotalDistance */3 :
          var match$1 = action[0];
          if (match$1.tag) {
            return state;
          } else {
            var amount = match$1[0];
            Stack.push(amount, state.everyCalculation);
            return {
                    visibleInputs: state.visibleInputs,
                    calculations: state.calculations,
                    lastStartingPoint: state.lastStartingPoint,
                    lastDestination: state.lastDestination,
                    totalDistance: state.totalDistance + amount,
                    everyCalculation: state.everyCalculation
                  };
          }
      
    }
  }
}

function calculateDistanceThenCreateNewInput(dispatch) {
  Curry._1(dispatch, /* AddNewInput */0);
  return Curry._1(dispatch, /* CalculateDistance */1);
}

function handleLastStartingPointChange($$event, dispatch) {
  $$event.persist();
  return Curry._1(dispatch, /* UpdateLastStartingPoint */Block.__(1, [$$event]));
}

function handleLastDestinationChange($$event, dispatch) {
  $$event.persist();
  return Curry._1(dispatch, /* UpdateLastDestination */Block.__(2, [$$event]));
}

function undoLastCalculation($$event, dispatch, state) {
  var lastItemOnStack = Stack.is_empty(state.everyCalculation) ? undefined : Stack.top(state.everyCalculation);
  if (lastItemOnStack === undefined) {
    Stack.push(0.0, state.everyCalculation);
  }
  return Curry._1(dispatch, /* RemoveInputAndSubtractFromTotalDistance */Block.__(0, [/* AmountToSubtract */Block.__(1, [Stack.pop(state.everyCalculation)])]));
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
                    var x = Caml_format.caml_float_of_string(List.hd($$String.split_on_char(/* " " */32, distance)));
                    Curry._1(dispatch, /* IncreaseTotalDistance */Block.__(3, [/* AmountToAdd */Block.__(0, [x])]));
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
                          dispatch: dispatch,
                          handleLastStartingPointChange: handleLastStartingPointChange,
                          handleLastDestinationChange: handleLastDestinationChange
                        })), React.createElement("button", {
                      style: nextDestinationButtonStyles,
                      onClick: (function ($$event) {
                          $$event.preventDefault();
                          Curry._1(dispatch, /* AddNewInput */0);
                          return Curry._1(dispatch, /* CalculateDistance */1);
                        })
                    }, "Next destination")), React.createElement("div", {
                  style: rightSideOfPageStyles
                }, React.createElement(TotalDistance$ReasonReactExamples.make, {
                      distance: Pervasives.string_of_float(state.totalDistance)
                    }), React.createElement(UndoButton$ReasonReactExamples.make, {
                      undoLastCalculation: (function ($$event) {
                          return undoLastCalculation($$event, dispatch, state);
                        })
                    })));
}

var make = App;

exports.wrapperStyles = wrapperStyles;
exports.nextDestinationButtonStyles = nextDestinationButtonStyles;
exports.undoButtonStyles = undoButtonStyles;
exports.rightSideOfPageStyles = rightSideOfPageStyles;
exports.initialState = initialState;
exports.reducer = reducer;
exports.calculateDistanceThenCreateNewInput = calculateDistanceThenCreateNewInput;
exports.handleLastStartingPointChange = handleLastStartingPointChange;
exports.handleLastDestinationChange = handleLastDestinationChange;
exports.undoLastCalculation = undoLastCalculation;
exports.make = make;
/* initialState Not a pure module */
