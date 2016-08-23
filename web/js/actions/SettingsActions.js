const AppDispatcher = require("./../dispatcher/AppDispatcher");
const SettingsConstants = require("./../constants/SettingsConstants");

module.exports = {
	loadSettings (callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.LOAD_SETTINGS,
			callback
		});
	},

	changePassword (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.CHANGE_PASSWORD,
			data,
			callback
		});
	},

	changeGlobalSignature (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.CHANGE_GLOBAL_SIGNATURE,
			data,
			callback
		});
	},

	setRecipientCacheEnabled (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.SET_RECIPIENT_CACHE_ENABLED,
			data,
			callback
		});
	},

	clearRecipientCache (callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.CLEAR_RECIPIENT_CACHE,
			callback
		});
	},

	changeReplyHeader (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.CHANGE_REPLY_HEADER,
			data,
			callback
		});
	},

	resetReplyHeader (callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.RESET_REPLY_HEADER,
			callback
		});
	},

	changeDefaultAccount (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.CHANGE_DEFAULT_ACCOUNT,
			data,
			callback
		});
	},

	removeAccount (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.REMOVE_ACCOUNT,
			data,
			callback
		});
	},

	addAccount (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.ADD_ACCOUNT,
			data,
			callback
		});
	},

	editAccount (data, callback) {
		AppDispatcher.handleAction({
			actionType: SettingsConstants.EDIT_ACCOUNT,
			data,
			callback
		});
	}
};