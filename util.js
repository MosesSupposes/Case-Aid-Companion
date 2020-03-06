function create(element, attributes) {
  const el = document.createElement(element);
  Object.entries(attributes).forEach(function applyAtributes([
    attrKey,
    attrVal
  ]) {
    el[attrKey] = attrVal;
  });

  return el;
}

function append(to = window.document, el) {
  return to.appendChild(el);
}

export { create, append };
