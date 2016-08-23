const $ = require("jquery");

let $window = $(window);

let windowWidth = $window.width();

let listeners = [];

$window.resize(() => {
	windowWidth = $window.width();

	$.each(listeners, (i, listener) => {
		if (listener._self.isMounted()) {
			listener.callback.call(listener._self);
		}
	});
});


let windowSize = {
	addAndCallListener (_self, callback) {
		if (typeof callback !== "function") {
			console.warn("windowSize.js: callback is not a function, listener cannot be added");
			return;
		}

		listeners.push({
			_self,
			callback
		});

		if (_self.isMounted()) {
			callback.call(_self);
		}
	},

	isLargeDevice () {
		return windowWidth >= 1200;
	}
};

module.exports = windowSize;