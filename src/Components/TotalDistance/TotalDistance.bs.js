'use strict';

var React = require("react");

var wrapperStyles = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center"
};

function TotalDistance(Props) {
  var distance = Props.distance;
  return React.createElement("div", {
              style: wrapperStyles
            }, React.createElement("div", {
                  style: {
                    margin: "1rem 0"
                  }
                }, "Total Distatnce: " + (distance + " miles")));
}

var make = TotalDistance;

exports.wrapperStyles = wrapperStyles;
exports.make = make;
/* react Not a pure module */
