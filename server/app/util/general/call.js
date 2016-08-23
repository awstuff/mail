"use strict";

module.exports = function (cb) {
	let args = Array.prototype.slice.call(arguments, 1);

	if (typeof cb === "function") {
		cb.apply(void 0, args);
	}
};