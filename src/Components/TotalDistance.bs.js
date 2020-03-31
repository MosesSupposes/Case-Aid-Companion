'use strict';

var React = require("react");

var wrapperStyles = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center"
};

function TotalDistance(Props) {
  var totalDistance = Props.totalDistance;
  return React.createElement("div", {
              style: wrapperStyles
            }, React.createElement("div", {
                  style: {
                    margin: "1rem 0"
                  }
                }, "Total Distatnce: " + (totalDistance + " miles")));
}

var make = TotalDistance;

exports.wrapperStyles = wrapperStyles;
exports.make = make;
/* react Not a pure module */
