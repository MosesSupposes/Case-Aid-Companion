/**
 * Imports
 */
import * as Util from "./util.js";

/**
 * Main
 */

/**
 * Helpers
 */
function createInput(attributes) {
  Util.create("input", attributes);
}

function createDestinationInputs(fromAttributes, toAttrubutes) {
  const from = Util.create("input", { placeholder: "From", ...fromAttributes });
  const to = Util.create("input", { placeholder: "To", ...toAttrubutes });
}
