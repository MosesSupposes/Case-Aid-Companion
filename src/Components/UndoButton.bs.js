'use strict';

var React = require("react");

var undoButtonStyles = {
  backgroundColor: "#cc3227",
  border: "1px solid black",
  color: "white",
  boxShadow: "none"
};

function UndoButton(Props) {
  Props.undoLastCalculation;
  return React.createElement("button", {
              style: undoButtonStyles
            }, "Undo");
}

var make = UndoButton;

exports.undoButtonStyles = undoButtonStyles;
exports.make = make;
/* react Not a pure module */
