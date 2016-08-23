const AppDispatcher = require("./../dispatcher/AppDispatcher");
const AccountConstants = require("./../constants/AccountConstants");

module.exports = {
	getAll (callback) {
		AppDispatcher.handleAction({
			actionType: AccountConstants.GET_ALL,
			callback
		});
	},

	renameMailbox (data, callback) {
		AppDispatcher.handleAction({
			actionType: AccountConstants.RENAME_MAILBOX,
			data,
			callback
		});
	},

	createMailbox (data, callback) {
		AppDispatcher.handleAction({
			actionType: AccountConstants.CREATE_MAILBOX,
			data,
			callback
		});
	},

	deleteMailbox (data, callback) {
		AppDispatcher.handleAction({
			actionType: AccountConstants.DELETE_MAILBOX,
			data,
			callback
		});
	}
};