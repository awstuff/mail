const AppDispatcher = require("./../dispatcher/AppDispatcher");
const MailboxConstants = require("./../constants/MailboxConstants");

module.exports = {
	setCurrentMailbox (data, callback) {
		AppDispatcher.handleAction({
			actionType: MailboxConstants.SET_CURRENT_MAILBOX,
			data,
			callback
		});
	}
};