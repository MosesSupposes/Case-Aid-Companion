import Utils from "./utils.js";
/**
 * Main
 */
// Here I'm wraping the Main function in an IIFE to avoid polluting the global namespace.
const appendToBody = Utils.append(document.body);
const renderDestinationInputs = Utils.compose(
  appendToBody,
  createDestinationInputs
);

renderDestinationInputs();

// render new destination component when the "+" button is presesd.
document
  .querySelector("#new_destination")
  .addEventListener("click", renderDestinationInputs);

/**
 * Helpers
 */
function createInput(attributes) {
  return Utils.create("input", attributes);
}

function createDestinationInputs(fromAttributes = {}, toAttrubutes = {}) {
  const container = Utils.create("div", {});

  const from = createInput({ placeholder: "From", ...fromAttributes });
  const to = createInput({ placeholder: "To", ...toAttrubutes });

  Utils.append(container, from);
  Utils.append(container, to);

  return container;
}
