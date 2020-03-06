const Util = (function() {
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

  function append(to, el) {
    return to.append(el);
  }

  function compose(...fns) {
    return function(initialValue) {
      return fns.reduceRight((acc, fn) => {
        return fn(acc);
      }, initialValue);
    };
  }

  function curry(fn, seen = []) {
    return function(...args) {
      return fn.length === seen.length + args.length
        ? fn(...seen, ...args)
        : curry(fn, [...seen, ...args]);
    };
  }

  return { create: curry(create), append: curry(append), compose, curry };
})();
