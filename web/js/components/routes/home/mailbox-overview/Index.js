const React = require("react");
const safeSetState = require("./../../../../util/safeSetState");
const MailboxStore = require("./../../../../stores/MailboxStore");
const BigCenteredCircularProgress = require("./../../../globals/circular-progress/BigCentered");
const ControlBar = require("./control-bar/Index");
const EmailList = require("./email-list/Index");
const ComposeNew = require("./compose-new/Index");

module.exports = React.createClass({
	displayName: "MailboxOverview",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: true	// does not work because the first loading event is being emitted before this component is even mounted
		};
	},

	componentDidMount () {
		MailboxStore.addMailboxLoadingListener(this.onMailboxLoading);
		MailboxStore.addMailboxFinishedLoadingListener(this.onMailboxFinishedLoading);
	},

	componentWillUnmount () {
		MailboxStore.removeMailboxLoadingListener(this.onMailboxLoading);
		MailboxStore.removeMailboxFinishedLoadingListener(this.onMailboxFinishedLoading);
	},

	onMailboxLoading () {
		this.safeSetState({
			showProgress: true
		});
	},

	onMailboxFinishedLoading () {
		this.safeSetState({
			showProgress: false
		});
	},

	render () {
		let contents;

		if (this.state.showProgress) {
			contents = (
				<BigCenteredCircularProgress
					show={true}
					className="big-centered-circular-progress"
				/>
			);
		} else {
			contents = [
				<ControlBar
					mailbox={this.props.mailbox}
					eMails={this.props.eMails}
					key="ControlBar"
				/>,
				<EmailList
					mailbox={this.props.mailbox}
					eMails={this.props.eMails}
					key="EmailList"
				/>,
				<ComposeNew key="ComposeNew" />
			];
		}

		return (
			<div className="mailbox-overview">
				{/* Keine Toolbar, mehr so der Google Inbox Look. Dh jede Mail hat ein righticonmenu.
				 In der Liste immer mit subheadern so sachen wie "heute", "diese woche", "letzte woche", "diesen monat", "älter" machen.
				 Als avatar bei jedem listeneintrag einen erzeugen, so wie links in der sidebar. */}
				{contents}
			</div>
		);
	}
});