const AppDispatcher = require("./../dispatcher/AppDispatcher");
const UserConstants = require("./../constants/UserConstants");

module.exports = {
	registerUser (data, callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.REGISTER_USER,
			data,
			callback
		});
	},

	loginUser (data, callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.LOGIN_USER,
			data,
			callback
		});
	},

	loginUserWithToken (callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.LOGIN_USER_WITH_TOKEN,
			callback
		});
	},

	logoutUser () {
		AppDispatcher.handleAction({
			actionType: UserConstants.LOGOUT_USER
		});
	},

	resetPassword (data, callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.RESET_PASSWORD,
			data,
			callback
		});
	},

	verifyResetPasswordLink (data, callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.VERIFY_RESET_PASSWORD_LINK,
			data,
			callback
		});
	},

	setNewPassword (data, callback) {
		AppDispatcher.handleAction({
			actionType: UserConstants.SET_NEW_PASSWORD,
			data,
			callback
		});
	}
};