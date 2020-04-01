'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

var wrapperStyles = {
  margin: ".75rem 0"
};

var inputStyles = {
  margin: "0 .5rem"
};

function DestinationInputs(Props) {
  var dispatch = Props.dispatch;
  var handleLastStartingPointChange = Props.handleLastStartingPointChange;
  var handleLastDestinationChange = Props.handleLastDestinationChange;
  Props.undoLastCalculation;
  return React.createElement("div", {
              style: wrapperStyles
            }, React.createElement("label", undefined, "From:", React.createElement("input", {
                      className: "from",
                      style: inputStyles,
                      type: "text",
                      onChange: (function ($$event) {
                          return Curry._2(handleLastStartingPointChange, $$event, dispatch);
                        })
                    })), React.createElement("label", undefined, "To:", React.createElement("input", {
                      className: "to",
                      style: inputStyles,
                      type: "text",
                      onChange: (function ($$event) {
                          return Curry._2(handleLastDestinationChange, $$event, dispatch);
                        })
                    })));
}

var make = DestinationInputs;

exports.wrapperStyles = wrapperStyles;
exports.inputStyles = inputStyles;
exports.make = make;
/* react Not a pure module */
