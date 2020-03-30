const Utils = (function() {
	function create(element, attributes = {}) {
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
		return to.appendChild(el);
	}

	function compose(...fns) {
		return function(initialValue) {
			return fns.reduceRight((acc, fn) => {
				return fn(acc);
			}, initialValue);
		};
	}

	function curry(fn) {
		return function currify() {
			const args = Array.prototype.slice.call(arguments);
			return args.length >= fn.length
				? fn.apply(null, args)
				: currify.bind(null, ...args);
		};
	}

	return { create: curry(create), append: curry(append), compose, curry };
})();

export default Utils;
