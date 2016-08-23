module.exports = function (b) {
	if (typeof b === "boolean") {
		return b;
	}

	if (typeof b === "string" || b instanceof String) {
		return b.toLowerCase() === "true";
	}

	return !!b;
};