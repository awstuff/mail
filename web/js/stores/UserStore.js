const _ = require("lodash");
const AppDispatcher = require("./../dispatcher/AppDispatcher");
const UserConstants = require("./../constants/UserConstants");
//const AccountActions = require("./../actions/AccountActions");
const EventEmitter = require("events").EventEmitter;
const validate = require("./../util/validate");
const _http = require("./../util/http/_http");
const call = require("./../util/call");
const apiRoutePaths = require("./../config-values/apiRoutePaths");
const localStorageKeys = require("./../config-values/localStorageKeys");
const debugging = require("./../config-values/debugging");

let currentUser = null;

function executeRequestAndLogin (url, data, callback) {	// registerUser and loginUser basically do the same thing, so here it is in one central location
	_http.post({
		url,
		delay: true,
		data: {
			eMail: data.eMail,
			password: data.password
		}
	}, res => {
		if (!validate.objectNotEmpty(res) || res.success === false || !+res.id || isNaN(res.defaultAccount) || !validate.stringNotEmpty([
				res.eMail,
				res.token,
				data.passphrase
			])) {
			call(callback, {
				success: false,
				errorMessage: res.errorMessage
			});
			return;
		}

		localStorage[localStorageKeys.passphrase] = data.passphrase;
		localStorage[localStorageKeys.token] = res.token;
		currentUser = res;

		//AccountActions.getAll(success => {
		//	if (success !== true) {
		//		UserStore.logoutUser();
		//		call(callback, {
		//			success: false,
		//			errorMessage: "Could not load accounts"
		//		});
		//		return;
		//	}

			call(callback, {
				success: true
			});

			UserStore.emitChange();
			UserStore.emitLogin();
		//});

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function registerUser (data, callback) {
	executeRequestAndLogin(apiRoutePaths.user.register, data, callback);
}

function loginUser (data, callback) {
	executeRequestAndLogin(apiRoutePaths.user.login, data, callback);
}

function loginWithToken (callback) {
	let token = localStorage[localStorageKeys.token];

	if (!validate.stringNotEmpty([
			token,
			localStorage[localStorageKeys.passphrase]	// passphrase needs to be validated as well, since it is only set on manual login, not now
		])) {
		call(callback, false);
		return;
	}

	_http.post({
		url: apiRoutePaths.user.loginWithToken,
		data: {
			token
		}
	}, res => {
		if (!validate.objectNotEmpty(res) || res.success === false || !+res.id || isNaN(res.defaultAccount) || !validate.stringNotEmpty([
				res.eMail,
				res.token
			])) {
			call(callback, false);
			return;
		}

		localStorage[localStorageKeys.token] = res.token;
		currentUser = res;

		//AccountActions.getAll(success => {
		//	if (success !== true) {
		//		UserStore.logoutUser();
		//		call(callback, {
		//			success: false,
		//			errorMessage: "Could not load accounts"
		//		});
		//		return;
		//	}

			call(callback, true);

			UserStore.emitChange();
			UserStore.emitLogin();
		//});

	}, () => {

		call(callback, false);

	});
}

function resetPassword (data, callback) {
	_http.post({
		url: apiRoutePaths.user.resetPassword.reset,
		delay: true,
		data: {
			eMail: data.eMail
		}
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function verifyLink (data, callback) {
	_http.post({
		url: apiRoutePaths.user.resetPassword.verifyLink,
		delay: true,
		data: {
			id: data.id
		}
	}, res => {

		call(callback, res);

	}, () => {

		call(callback, {
			success: false
		});
	});
}

function setNewPassword (data, callback) {
	_http.post({
		url: apiRoutePaths.user.resetPassword.setNew,
		delay: true,
		data: {
			id: data.id,
			eMail: data.eMail,
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


const UserStore = _.assignIn({

	addChangeListener (callback) {
		this.on("change", callback);
	},

	addLoginListener (callback) {
		if (this.isAuthenticated()) {	// if the user is already logged in, call the callback right away
			call(callback);
		}

		this.on("login", callback);
	},

	emitChange () {
		this.emit("change");
	},

	emitLogin () {
		if (debugging) {
			console.debug("emitting UserStore login event");
		}

		this.emit("login");
	},

	getCurrentUser () {
		return currentUser;
	},

	isAuthenticated () {
		return validate.objectNotEmpty(currentUser) && +currentUser.id && !isNaN(currentUser.defaultAccount) && validate.stringNotEmpty([
			currentUser.eMail,
			currentUser.token,
			localStorage[localStorageKeys.token],
			localStorage[localStorageKeys.passphrase]
		]);
	},

	logoutUser () {
		localStorage.removeItem(localStorageKeys.token);
		localStorage.removeItem(localStorageKeys.passphrase);
		currentUser = null;
	},

	removeChangeListener (callback) {
		this.removeListener("change", callback);
	},

	removeLoginListener (callback) {
		this.removeListener("login", callback);
	}

}, EventEmitter.prototype);


UserStore.dispatchToken = AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.actionType) {
		case UserConstants.REGISTER_USER:
			registerUser(action.data, action.callback);
			break;

		case UserConstants.LOGIN_USER:
			loginUser(action.data, action.callback);
			break;

		case UserConstants.LOGIN_USER_WITH_TOKEN:
			loginWithToken(action.callback);
			break;

		//case UserConstants.LOGOUT_USER:
		//	logoutUser();
		//	break;

		case UserConstants.RESET_PASSWORD:
			resetPassword(action.data, action.callback);
			break;

		case UserConstants.VERIFY_RESET_PASSWORD_LINK:
			verifyLink(action.data, action.callback);
			break;

		case UserConstants.SET_NEW_PASSWORD:
			setNewPassword(action.data, action.callback);
			break;

		default:
			return true;
	}
});


module.exports = UserStore;