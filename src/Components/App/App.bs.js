'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Stack = require("bs-platform/lib/js/stack.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var UndoButton$ReasonReactExamples = require("../UndoButton/UndoButton.bs.js");
var TotalDistance$ReasonReactExamples = require("../TotalDistance/TotalDistance.bs.js");
var DestinationInputs$ReasonReactExamples = require("../DestinationInputs/DestinationInputs.bs.js");

var wrapperStyles = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gridTemplateRows: "4fr 1fr"
};

var nextDestinationButtonStyles = {
  marginTop: ".35rem",
  gridRowStart: "2"
};

var leftSideOfPageStyles = {
  gridColumnStart: "1"
};

var middleOfPageStyles = {
  gridColumnStart: "2"
};

var rightSideOfPageStyles = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "space-between",
  gridColumnStart: "3"
};

var initialState_everyCalculation = Stack.create(undefined);

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
    switch (action) {
      case /* AddNewInput */0 :
          return {
                  visibleInputs: state.visibleInputs + 1 | 0,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance,
                  everyCalculation: state.everyCalculation
                };
      case /* CalculateDistance */1 :
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations + 1 | 0,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance,
                  everyCalculation: state.everyCalculation
                };
      case /* Reset */2 :
          return initialState;
      
    }
  } else {
    switch (action.tag | 0) {
      case /* RemoveInputAndSubtractFromTotalDistance */0 :
          var amount = action[0];
          if (amount.tag) {
            return {
                    visibleInputs: state.visibleInputs > 0 ? state.visibleInputs - 1 | 0 : state.visibleInputs,
                    calculations: state.calculations,
                    lastStartingPoint: state.lastStartingPoint,
                    lastDestination: state.lastDestination,
                    totalDistance: state.totalDistance - amount[0],
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
          var amount$1 = action[0];
          if (amount$1.tag) {
            return state;
          }
          var amount$2 = amount$1[0];
          Stack.push(amount$2, state.everyCalculation);
          return {
                  visibleInputs: state.visibleInputs,
                  calculations: state.calculations,
                  lastStartingPoint: state.lastStartingPoint,
                  lastDestination: state.lastDestination,
                  totalDistance: state.totalDistance + amount$2,
                  everyCalculation: state.everyCalculation
                };
      
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

function renderEachCalculation(stack) {
  var arr = {
    contents: []
  };
  Stack.iter((function (x) {
          arr.contents = Belt_Array.concat([x], arr.contents);
          
        }), stack);
  arr.contents = Belt_Array.mapWithIndex(arr.contents, (function (i, value) {
          if (i === (arr.contents.length - 1 | 0)) {
            return 0.0;
          } else {
            return Caml_array.caml_array_get(arr.contents, i + 1 | 0);
          }
        }));
  return $$Array.map((function (c) {
                return React.createElement("div", {
                            style: {
                              marginBottom: "13px",
                              position: "relative",
                              top: "12.5px"
                            }
                          }, c.toString() + " mi.");
              }), arr.contents);
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
                    var distance = ((jsonResponse.rows.length && jsonResponse.rows[0].elements[0].distance.text) || "0.0");
                    var x = Caml_format.caml_float_of_string(List.hd($$String.split_on_char(/* " " */32, distance)));
                    Curry._1(dispatch, /* IncreaseTotalDistance */Block.__(3, [/* AmountToAdd */Block.__(0, [x])]));
                    return Promise.resolve(undefined);
                  })).catch((function (_err) {
                  console.log(_err);
                  return Promise.resolve(undefined);
                }));
          
        }), [state.calculations]);
  return React.createElement("div", {
              style: wrapperStyles
            }, React.createElement("form", {
                  style: leftSideOfPageStyles
                }, Caml_array.caml_make_vect(state.visibleInputs, React.createElement(DestinationInputs$ReasonReactExamples.make, {
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
                      distance: state.totalDistance.toFixed(2)
                    }), React.createElement(UndoButton$ReasonReactExamples.make, {
                      undoLastCalculation: (function ($$event) {
                          return undoLastCalculation($$event, dispatch, state);
                        })
                    })));
}

var make = App;

exports.wrapperStyles = wrapperStyles;
exports.nextDestinationButtonStyles = nextDestinationButtonStyles;
exports.leftSideOfPageStyles = leftSideOfPageStyles;
exports.middleOfPageStyles = middleOfPageStyles;
exports.rightSideOfPageStyles = rightSideOfPageStyles;
exports.initialState = initialState;
exports.reducer = reducer;
exports.calculateDistanceThenCreateNewInput = calculateDistanceThenCreateNewInput;
exports.handleLastStartingPointChange = handleLastStartingPointChange;
exports.handleLastDestinationChange = handleLastDestinationChange;
exports.undoLastCalculation = undoLastCalculation;
exports.renderEachCalculation = renderEachCalculation;
exports.make = make;
/* initialState Not a pure module */
