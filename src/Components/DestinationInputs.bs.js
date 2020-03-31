'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function DestinationInputs(Props) {
  var handleLastStartingPointChange = Props.handleLastStartingPointChange;
  var handleLastDestinationChange = Props.handleLastDestinationChange;
  var dispatch = Props.dispatch;
  return React.createElement("div", undefined, React.createElement("label", undefined, "From:", React.createElement("input", {
                      className: "from",
                      type: "text",
                      onChange: (function ($$event) {
                          return Curry._2(handleLastStartingPointChange, $$event, dispatch);
                        })
                    })), React.createElement("label", undefined, "To:", React.createElement("input", {
                      className: "to",
                      type: "text",
                      onChange: (function ($$event) {
                          return Curry._2(handleLastDestinationChange, $$event, dispatch);
                        })
                    })));
}

var make = DestinationInputs;

exports.make = make;
/* react Not a pure module */
