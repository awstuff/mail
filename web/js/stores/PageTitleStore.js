const _ = require("lodash");
const AppDispatcher = require("./../dispatcher/AppDispatcher");
//const PageTitleConstants = require("./../constants/PageTitleConstants");
const EventEmitter = require("events").EventEmitter;
const validate = require("./../util/validate");
const appName = require("./../config-values/appName");
const debugging = require("./../config-values/debugging");

let _title = appName;

function setTitle (title) {
	if (!validate.stringNotEmpty(title)) {
		if (debugging) {
			console.error("Could not set page title: empty title specified.");
		}

		return;
	}

	//_title = title + " — " + appName;	// em dash
	_title = title + " - " + appName;

	//console.log(_title);

	document.title = _title;

	PageTitleStore.emitChange();
}

function resetTitle () {
	_title = appName;

	//console.log("resetting shit");

	document.title = _title;

	PageTitleStore.emitChange();
}

const PageTitleStore = _.assignIn({

	addChangeListener (callback) {
		this.on("change", callback);
	},

	emitChange () {
		this.emit("change");
	},

	getTitle () {
		return _title;
	},

	setTitle,

	resetTitle,

	removeChangeListener (callback) {
		this.removeListener("change", callback);
	}

}, EventEmitter.prototype);


PageTitleStore.dispatchToken = AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.actionType) {
		//case PageTitleConstants.SET_TITLE:
		//	setTitle(action.title);
		//	break;
		//
		//case PageTitleConstants.RESET_TITLE:
		//	resetTitle();
		//	break;

		default:
			return true;
	}
});


module.exports = PageTitleStore;