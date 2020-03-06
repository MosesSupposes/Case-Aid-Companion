/**
 * Main
 */
// Here I'm wraping the Main function in an IIFE to avoid polluting the global namespace.
(function Main() {
  const appendToBody = Util.append(document.body);
  const renderDestinationInputs = Util.compose(
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
})();
