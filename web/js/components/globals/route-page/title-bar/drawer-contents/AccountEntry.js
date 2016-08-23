const _ = require("lodash");
const React = require("react");
const ListItem = require("material-ui/List").ListItem;
const Avatar = require("material-ui/Avatar").default;
const FontIcon = require("material-ui/FontIcon").default;
const safeSetState = require("./../../../../../util/safeSetState");
const colors = require("./../../../../../config-values/colors");
const MailboxEntry = require("./mailbox-entry/Index");
const CreateMailboxDialog = require("./CreateMailboxDialog");

module.exports = React.createClass({
	displayName: "AccountEntry",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showCreateDialog: false
		}
	},

	handleCreateNewMailboxClick () {
		this.safeSetState({
			showCreateDialog: true
		});
	},

	handleCreateDialogClose () {
		this.safeSetState({
			showCreateDialog: false
		});
	},

	render () {
		let fromNameSplit = this.props.account.fromName.split(" ");
		let avatarText;

		if (fromNameSplit.length > 1) {
			avatarText = fromNameSplit[0][0].toLocaleUpperCase() + fromNameSplit[1][0].toLocaleUpperCase();
		} else if (fromNameSplit.length === 1 && fromNameSplit[0].length > 0) {
			avatarText = fromNameSplit[0][0].toLocaleUpperCase();
		} else {	// this should actually never happen
			avatarText = this.props.account.eMail[0].toLocaleUpperCase();
		}

		return (
			<ListItem
				initiallyOpen={true}
				className="account-entry"
				disabled={true}
				title={this.props.account.fromName + " <" + this.props.account.eMail + ">"}
				primaryText={
					<div>
						<div className="text-ellipsis">
							{this.props.account.fromName}
						</div>
						<CreateMailboxDialog account={this.props.account.id} handleClose={this.handleCreateDialogClose} open={this.state.showCreateDialog} />
					</div>
				}
				secondaryText={
					<div className="text-ellipsis">
						{this.props.account.eMail}
					</div>
				}
				leftAvatar={
					<Avatar
						className="avatar"
						backgroundColor={colors.accent1}
					>
						{avatarText}
					</Avatar>
				}
				nestedItems={[
					<ListItem
						className="create-new-mailbox-item"
						key={this.props.account.eMail + "#createnewmailbox"}
						primaryText={
							<div className="text-ellipsis">
								Create new mailbox
							</div>
						}
						leftIcon={
							<FontIcon className="material-icons">create</FontIcon>
						}
						onTouchTap={this.handleCreateNewMailboxClick}
						nestedLevel={-2}
					/>,
					..._.map(this.props.account.mailboxes, mailbox => {
						return (
							<MailboxEntry
								mailbox={mailbox}
								key={this.props.account.eMail + "#" + mailbox.name}
								currentNestedLevel={-2}
								account={this.props.account.id}
								previousPath=""
								toggleClose={this.props.toggleClose}
							/>
						);
					})
				]}
			/>
		);
	}
});