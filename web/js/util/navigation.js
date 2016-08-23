let history;

module.exports = {
	setHistory (h) {
		history = h;
	},

	goto (path) {
		if (!history) {
			console.error("Cannot navigate to '" + path + "': history is empty");
			return;
		}

		history.push(path);
	}
};