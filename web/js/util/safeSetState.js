const debugging = require("./../config-values/debugging");

module.exports = {

	safeSetState (data, callback) {
		if (this.isMounted()) {
			this.setState(data, callback);
		} else {
			if (debugging) {
				console.warn("safeSetState: Aborting state change on component '" + this.displayName + "': Component is not mounted.");
			}
		}
	}

};