const _ = require("lodash");
const Promise = require("es6-promise").Promise;
const AppDispatcher = require("./../dispatcher/AppDispatcher");
const SettingsConstants = require("./../constants/SettingsConstants");
const UserStore = require("./UserStore");
const EventEmitter = require("events").EventEmitter;
const validate = require("./../util/validate");
const _http = require("./../util/http/_http");
const call = require("./../util/call");
const apiRoutePaths = require("./../config-values/apiRoutePaths");

let settings = null;

function getAccountsNotSortedByDefault (callback) {
	_http.get({
		url: apiRoutePaths.account.getAllNotSortedByDefault
	}, res => {
		if (!res || !_.isArray(res)) {
			call(callback, false);
			return;
		}

		call(callback, res);

	}, () => {

		call(callback, false);

	});
}

function getDefaultAccount (callback) {
	_http.get({
		url: apiRoutePaths.account.getDefault
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function getReplyHeader (callback) {
	_http.get({
		url: apiRoutePaths.replyHeader.get_
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function loadSettings (callback) {
	let localSettings = {};	// "working copy"

	let userPromise = new Promise((resolve, reject) => {
		let currentUser = UserStore.getCurrentUser();	// defaultAccount, globalSignature, replyHeader

		if (!currentUser || isNaN(currentUser.defaultAccount)) {	// it's possible for globalSignature and replyHeader to have empty values
			reject();
			return;
		}

		localSettings.defaultAccount = currentUser.defaultAccount;
		localSettings.globalSignature = currentUser.globalSignature;
		localSettings.replyHeader = currentUser.replyHeader;
		resolve();
	});

	let accountsPromise = new Promise((resolve, reject) => {
		//let accounts = AccountStore.getAccounts();
		//
		//if (!_.isArray(accounts)) {
		//	reject();
		//	return;
		//}
		//
		//localSettings.accounts = accounts;
		//resolve();

		getAccountsNotSortedByDefault(accounts => {
			if (!_.isArray(accounts)) {
				reject();
				return;
			}

			localSettings.accounts = accounts;
			resolve();
		});
	});

	let recipientCachePromise = new Promise((resolve, reject) => {
		_http.get({
			url: apiRoutePaths.recipientCache.isEnabled,
			delay: true
		}, res => {

			if (!res || (res.isEnabled !== true && res.isEnabled !== false)) {
				reject();
				return;
			}

			localSettings.recipientCacheIsEnabled = res.isEnabled;
			resolve();
		}, () => {
			reject();
		});
	});

	Promise.all([
		userPromise,
		accountsPromise,
		recipientCachePromise
	]).then(() => {	// all three have been resolved

		settings = localSettings;
		SettingsStore.emitChange();
		call(callback, true);

	}, () => {	// at least one has been rejected

		call(callback, false);

	});
}

function changePassword (data, callback) {
	_http.post({
		url: apiRoutePaths.user.changePassword,
		delay: true,
		data: {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword
		}
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function changeGlobalSignature (data, callback) {
	_http.post({
		url: apiRoutePaths.signature.setGlobal,
		delay: true,
		data: {
			globalSignature: data.globalSignature
		}
	}, res => {

		SettingsStore.emitChange();
		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function setRecipientCacheEnabled (data, callback) {
	_http.post({
		url: apiRoutePaths.recipientCache.setEnabled,
		delay: true,
		data: {
			enabled: data.enabled
		}
	}, res => {

		SettingsStore.emitChange();
		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function clearRecipientCache (callback) {
	_http.post({
		url: apiRoutePaths.recipientCache.clear,
		delay: true
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function changeReplyHeader (data, callback) {
	_http.post({
		url: apiRoutePaths.replyHeader.set_,
		delay: true,
		data: {
			replyHeader: data.replyHeader
		}
	}, res => {

		SettingsStore.emitChange();
		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function resetReplyHeader (callback) {
	_http.post({
		url: apiRoutePaths.replyHeader.reset,
		delay: true
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getReplyHeader(res => {
			if (res.success === false) {
				call(callback, {
					success: false,
					errorMessage: res.errorMessage
				});
				return;
			}

			settings.replyHeader = res.replyHeader;
			SettingsStore.emitChange();
			call(callback, {
				success: true
			});
		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function changeDefaultAccount (data, callback) {
	_http.post({
		url: apiRoutePaths.account.setDefault,
		delay: true,
		data: {
			id: data.id
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getDefaultAccount(innerRes => {
			if (innerRes.success === false) {
				call(callback, {
					success: false,
					errorMessage: innerRes.errorMessage
				});
				return;
			}

			settings.defaultAccount = innerRes.defaultAccount;
			SettingsStore.emitChange();
			call(callback, {
				success: true
			});
		});
	}, () => {

		call(callback, {
			success: false
		});
	});
}

function removeAccount (data, callback) {
	_http.post({
		url: apiRoutePaths.account.remove,
		delay: true,
		data: {
			id: data.id
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		let _accounts;
		let _defaultAccount;

		let accountsPromise = new Promise((resolve, reject) => {
			getAccountsNotSortedByDefault(accounts => {
				if (!_.isArray(accounts)) {
					reject();
					return;
				}

				_accounts = accounts;
				resolve();
			});
		});

		let defaultAccountPromise = new Promise((resolve, reject) => {
			getDefaultAccount(innerRes => {
				if (innerRes.success === false) {
					reject();
					return;
				}

				_defaultAccount = innerRes.defaultAccount;
				resolve();
			});
		});

		Promise.all([
			accountsPromise,
			defaultAccountPromise
		]).then(() => {	// both have been resolved

			settings.accounts = _accounts;
			settings.defaultAccount = _defaultAccount;
			SettingsStore.emitChange();
			call(callback, {
				success: true
			});

		}, () => {	// at least one has been rejected

			call(callback, {
				success: false
			});

		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function addOrEditAccount (url, data, callback) {
	_http.post({
		url,
		delay: true,
		data: {
			id: data.id,
			eMail: data.eMail,
			fromName: data.fromName,
			smtp: data.smtp,
			imap: data.imap
		}
	}, res => {

		if (res.success !== true) {
			call(callback, res);
			return;
		}

		getAccountsNotSortedByDefault(accounts => {
			if (!_.isArray(accounts)) {
				call(callback, {
					success: false
				});
				return;
			}

			settings.accounts = accounts;

			SettingsStore.emitChange();

			call(callback, {
				success: true
			});
		});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function addAccount (data, callback) {
	addOrEditAccount(apiRoutePaths.account.add, data, callback);
}

function editAccount (data, callback) {
	addOrEditAccount(apiRoutePaths.account.edit, data, callback);
}


const SettingsStore = _.assignIn({

	addChangeListener (callback) {
		this.on("change", callback);
	},

	emitChange () {
		this.emit("change");
	},

	getSettings () {
		return settings;
	},

	removeChangeListener (callback) {
		this.removeListener("change", callback);
	}

}, EventEmitter.prototype);


SettingsStore.dispatchToken = AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.actionType) {
		case SettingsConstants.LOAD_SETTINGS:
			loadSettings(action.callback);
			break;

		case SettingsConstants.CHANGE_PASSWORD:
			changePassword(action.data, action.callback);
			break;

		case SettingsConstants.CHANGE_GLOBAL_SIGNATURE:
			changeGlobalSignature(action.data, action.callback);
			break;

		case SettingsConstants.SET_RECIPIENT_CACHE_ENABLED:
			setRecipientCacheEnabled(action.data, action.callback);
			break;

		case SettingsConstants.CLEAR_RECIPIENT_CACHE:
			clearRecipientCache(action.callback);
			break;

		case SettingsConstants.CHANGE_REPLY_HEADER:
			changeReplyHeader(action.data, action.callback);
			break;

		case SettingsConstants.RESET_REPLY_HEADER:
			resetReplyHeader(action.callback);
			break;

		case SettingsConstants.CHANGE_DEFAULT_ACCOUNT:
			changeDefaultAccount(action.data, action.callback);
			break;

		case SettingsConstants.REMOVE_ACCOUNT:
			removeAccount(action.data, action.callback);
			break;

		case SettingsConstants.ADD_ACCOUNT:
			addAccount(action.data, action.callback);
			break;

		case SettingsConstants.EDIT_ACCOUNT:
			editAccount(action.data, action.callback);
			break;

		default:
			return true;
	}
});


module.exports = SettingsStore;