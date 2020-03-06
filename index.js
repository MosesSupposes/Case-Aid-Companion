/**
 * Main
 */

Util.append(document.body, createDestinationInputs());

/**
 * Helpers
 */
function createInput(attributes) {
  return Util.create("input", attributes);
}

function createDestinationInputs(fromAttributes = {}, toAttrubutes = {}) {
  const container = Util.create("div", {});

  const from = createInput({ placeholder: "From", ...fromAttributes });
  const to = createInput({ placeholder: "To", ...toAttrubutes });

  Util.append(container, from);
  Util.append(container, to);

  return container;
}
