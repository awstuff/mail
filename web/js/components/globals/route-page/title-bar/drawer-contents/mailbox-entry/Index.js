const _ = require("lodash");
const React = require("react");
const List = require("material-ui/List").List;
const ListItem = require("material-ui/List").ListItem;
const Avatar = require("material-ui/Avatar").default;
const FontIcon = require("material-ui/FontIcon").default;
const IconButton = require("material-ui/IconButton").default;
const IconMenu = require("material-ui/IconMenu").default;
const MenuItem = require("material-ui/MenuItem").default;
const GreyMoreVertIcon = require("./../../../../../globals/grey-more-vert-icon/Index");
const safeSetState = require("./../../../../../../util/safeSetState");
const colors = require("./../../../../../../config-values/colors");
const RenameDialog = require("./RenameDialog");
const DeleteDialog = require("./DeleteDialog");
const ErrorDialog = require("./../../../../dialogs/ErrorDialog");
const MailboxActions = require("./../../../../../../actions/MailboxActions");

const MailboxEntry = React.createClass({	// necessary for recursive rendering
	displayName: "MailboxEntry",

	mixins: [safeSetState],

	getInitialState () {
		return {
			qualifiedName: this.props.previousPath + this.props.mailbox.name,
			showRenameDialog: false,
			showDeleteDialog: false,
			showErrorDialog: false
		}
	},

	handleRenameClick () {
		this.safeSetState({
			showRenameDialog: true
		});
	},

	handleDeleteClick () {
		this.safeSetState({
			showDeleteDialog: true
		});
	},

	handleRenameDialogClose () {
		this.safeSetState({
			showRenameDialog: false
		});
	},

	handleDeleteDialogClose () {
		this.safeSetState({
			showDeleteDialog: false
		});
	},

	handleClick () {
		MailboxActions.setCurrentMailbox({
			account: this.props.account,
			mailbox: this.state.qualifiedName
		}, success => {
			if (success !== true) {
				this.safeSetState({
					showErrorDialog: true
				});
			}
		});

		this.props.toggleClose();
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	render () {
		let iconName;

		if (this.props.mailbox.isInboxFolder) {
			iconName = "inbox";
		} else if (this.props.mailbox.isDraftsFolder) {
			iconName = "drafts";
		} else if (this.props.mailbox.isSentFolder) {
			iconName = "send";
		} else if (this.props.mailbox.isJunkFolder) {
			iconName = "cancel";
		} else if (this.props.mailbox.isTrashFolder) {
			iconName = "delete";
		} else if (this.props.mailbox.isArchiveFolder) {
			iconName = "archive";
		} else {
			iconName = "folder";
		}

		let unseenCount = +this.props.mailbox.unseenCount;	// should be a number already, but fuck it
		if (unseenCount > 0) {
			unseenCount = (
				<span className="badge">
					{unseenCount}
				</span>
			);
		} else {
			unseenCount = null;
		}

		let currentNestedLevel = this.props.currentNestedLevel + 2;

		const rightIconMenu = (
			<IconMenu
				iconButtonElement={
					<IconButton	touch={true}>
						<GreyMoreVertIcon/>
					</IconButton>
				}
			>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">mode_edit</FontIcon>
					}
					primaryText="Rename"
					onTouchTap={this.handleRenameClick}
				/>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">delete</FontIcon>
					}
					primaryText="Delete"
					onTouchTap={this.handleDeleteClick}
				/>
			</IconMenu>
		);

		return (
			<ListItem
				className="mailbox-entry"
				initiallyOpen={true}
				nestedLevel={currentNestedLevel}
				primaryText={
					<div>
						<div className="text-ellipsis">
							{this.props.mailbox.name}
							{unseenCount}
						</div>
						<RenameDialog
							oldName={this.state.qualifiedName}
							account={this.props.account}
							handleClose={this.handleRenameDialogClose}
							open={this.state.showRenameDialog}
						/>
						<DeleteDialog
							name={this.state.qualifiedName}
							account={this.props.account}
							handleClose={this.handleDeleteDialogClose}
							open={this.state.showDeleteDialog}
						/>
						<ErrorDialog
							open={this.state.showErrorDialog}
							handleClose={this.handleErrorDialogClose}
							message="Fetching emails failed"
						/>
					</div>
				}
				leftIcon={
					<FontIcon className="material-icons">{iconName}</FontIcon>
				}
				rightIconButton={rightIconMenu}
				onTouchTap={this.handleClick}
				nestedItems={_.map(this.props.mailbox.children, mailbox => {
					return (
						<MailboxEntry
							mailbox={mailbox}
							key={this.props.mailbox.name + "#" + mailbox.name}
							currentNestedLevel={currentNestedLevel}
							account={this.props.account}
							previousPath={this.state.qualifiedName + "/"}
							toggleClose={this.props.toggleClose}
						/>
					);
				})}
			/>
		);
	}
});

module.exports = MailboxEntry;