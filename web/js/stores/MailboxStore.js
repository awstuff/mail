const _ = require("lodash");
const AppDispatcher = require("./../dispatcher/AppDispatcher");
const MailboxConstants = require("./../constants/MailboxConstants");
const EventEmitter = require("events").EventEmitter;
const validate = require("./../util/validate");
const _http = require("./../util/http/_http");
const call = require("./../util/call");
const apiRoutePaths = require("./../config-values/apiRoutePaths");
const debugging = require("./../config-values/debugging");
const PageTitleStore = require("./PageTitleStore");

let currentMailbox = null;
let eMails = {};

function setCurrentMailbox (data, callback) {
	if (!data || isNaN(data.account) || !validate.stringNotEmpty(data.mailbox)) {
		if (debugging) {
			console.warn("Could not set empty mailbox: invalid data", data);
		}
		return;
	}

	currentMailbox = data;
	PageTitleStore.setTitle(data.mailbox);

	MailboxStore.emitChange();

	MailboxStore.emitMailboxLoading();

	_http.post({
		delay: true,
		url: apiRoutePaths.mailbox.getContents,
		data: {
			account: data.account,
			mailbox: data.mailbox,
			page: 1
		}
	}, res => {
		if (!res || res.success === false || !_.isArray(res.messages)) {
			call(callback, false);
			return;
		}

		eMails = res;

		MailboxStore.emitMailboxFinishedLoading();

		MailboxStore.emitChange();

		call(callback, true);

	}, () => {

		call(callback, false);

	});
}

const MailboxStore = _.assignIn({

	addChangeListener (callback) {
		this.on("change", callback);
	},

	addMailboxLoadingListener (callback) {
		this.on("mailbox-loading", callback);
	},

	addMailboxFinishedLoadingListener (callback) {
		this.on("finished", callback);
	},

	emitChange () {
		this.emit("change");
	},

	emitMailboxLoading () {
		this.emit("mailbox-loading");
	},

	emitMailboxFinishedLoading () {
		this.emit("finished");
	},

	getCurrentMailbox () {
		return currentMailbox;
	},

	getEmails () {
		return eMails;
	},

	removeChangeListener (callback) {
		this.removeListener("change", callback);
	},

	removeMailboxLoadingListener (callback) {
		this.removeListener("mailbox-loading", callback);
	},

	removeMailboxFinishedLoadingListener (callback) {
		this.removeListener("finished", callback);
	}

}, EventEmitter.prototype);


MailboxStore.dispatchToken = AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.actionType) {
		case MailboxConstants.SET_CURRENT_MAILBOX:
			setCurrentMailbox(action.data, action.callback);
			break;

		default:
			return true;
	}
});


module.exports = MailboxStore;