const React = require("react");
const RoutePage = require("./../../globals/route-page/Index");
const PageTitleStore = require("./../../../stores/PageTitleStore");
const MailboxStore = require("./../../../stores/MailboxStore");
const AccountStore = require("./../../../stores/AccountStore");
const safeSetState = require("./../../../util/safeSetState");
const validate = require("./../../../util/validate");
const NoAccountNotification = require("./NoAccountNotification");
const MailboxOverview = require("./mailbox-overview/Index");

module.exports = React.createClass({
	displayName: "HomeRoute",

	mixins: [safeSetState],

	getInitialState () {
		return {
			currentMailbox: MailboxStore.getCurrentMailbox(),
			eMails: MailboxStore.getEmails()
		}
	},

	componentDidMount () {
		PageTitleStore.resetTitle();

		AccountStore.firstFetchIsDone = false;

		MailboxStore.addChangeListener(this.onStoreStateChange);
	},

	//componentDidUpdate () {
	//	PageTitleStore.resetTitle();
	//},

	componentWillUnmount () {
		MailboxStore.removeChangeListener(this.onStoreStateChange);
	},

	onStoreStateChange () {
		this.safeSetState({
			currentMailbox: MailboxStore.getCurrentMailbox(),
			eMails: MailboxStore.getEmails()
		});
	},

	render () {
		let contents;

		if (validate.objectNotEmpty(this.state.currentMailbox)) {
			contents = (
				<MailboxOverview
					mailbox={this.state.currentMailbox}
					eMails={this.state.eMails}
				/>
			);
		} else {
			contents = (
				<NoAccountNotification/>
			);
		}

		return (
			<RoutePage>
				{contents}
			</RoutePage>
		);
	}
});