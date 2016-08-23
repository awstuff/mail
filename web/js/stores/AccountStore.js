const _ = require("lodash");
const AppDispatcher = require("./../dispatcher/AppDispatcher");
const AccountConstants = require("./../constants/AccountConstants");
const EventEmitter = require("events").EventEmitter;
const validate = require("./../util/validate");
const _http = require("./../util/http/_http");
const call = require("./../util/call");
const apiRoutePaths = require("./../config-values/apiRoutePaths");

let accounts = [];

function getAll (callback) {
	_http.get({
		delay: true,
		url: apiRoutePaths.account.getAllWithMailboxes
	}, res => {
		if (!res || !_.isArray(res)) {
			call(callback, false);
			return;
		}

		accounts = res;

		AccountStore.emitChange();

		call(callback, true);

	}, () => {

		call(callback, false);

	});
}

function renameMailbox (data, callback) {
	_http.post({
		url: apiRoutePaths.mailbox.rename,
		data: {
			account: data.account,
			oldName: data.oldName,
			newName: data.newName
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getAll(success => {
			call(callback, {
				success
			});
		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function deleteMailbox (data, callback) {
	_http.post({
		url: apiRoutePaths.mailbox.delete_,
		data: {
			account: data.account,
			name: data.name
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getAll(success => {
			call(callback, {
				success
			});
		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function createMailbox (data, callback) {
	_http.post({
		url: apiRoutePaths.mailbox.add,
		data: {
			account: data.account,
			name: data.name
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getAll(success => {
			call(callback, {
				success
			});
		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}



const AccountStore = _.assignIn({

	addChangeListener (callback) {
		this.on("change", callback);
	},

	emitChange () {
		this.emit("change");
	},

	getAccounts () {
		return accounts;
	},

	removeChangeListener (callback) {
		this.removeListener("change", callback);
	},

	firstFetchIsDone: false

}, EventEmitter.prototype);


AccountStore.dispatchToken = AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.actionType) {
		case AccountConstants.GET_ALL:
			getAll(action.callback);
			break;

		case AccountConstants.RENAME_MAILBOX:
			renameMailbox(action.data, action.callback);
			break;

		case AccountConstants.DELETE_MAILBOX:
			deleteMailbox(action.data, action.callback);
			break;

		case AccountConstants.CREATE_MAILBOX:
			createMailbox(action.data, action.callback);
			break;

		default:
			return true;
	}
});


module.exports = AccountStore;