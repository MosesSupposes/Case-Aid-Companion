'use strict';

var $$Array = require("bs-platform/lib/js/array.js");

function push(value, stack) {
  return $$Array.append(stack, [value]);
}

function pop(stack) {
  return $$Array.sub(stack, 0, stack.length - 1 | 0);
}

var Stack = {
  push: push,
  pop: pop
};

exports.Stack = Stack;
/* No side effect */
