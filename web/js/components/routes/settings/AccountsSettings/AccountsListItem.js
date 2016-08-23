const React = require("react");
const ListItem = require("material-ui/List").ListItem;
const Divider = require("material-ui/Divider").default;
const FontIcon = require("material-ui/FontIcon").default;
const IconButton = require("material-ui/IconButton").default;
const IconMenu = require("material-ui/IconMenu").default;
const MenuItem = require("material-ui/MenuItem").default;
const ErrorDialog = require("./../../../globals/dialogs/ErrorDialog");
const GreyMoreVertIcon = require("./../../../globals/grey-more-vert-icon/Index");
const SettingsActions = require("./../../../../actions/SettingsActions");
const AddEditAccountDialog = require("./AddEditAccountDialog");
const call = require("./../../../../util/call");
const safeSetState = require("./../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "AccountsListItem",

	mixins: [safeSetState],

	getInitialState () {
		return {
			//showEditAccountDialog: false,
			showErrorDialog: {
				setAsDefault: false,
				remove: false
			},
			errorDialogErrorMessage: {
				setAsDefault: "",
				remove: ""
			},
			currentDialog: null	// this is really NOT the way you should do this, but for some reason it's the only one that works (TODO)
		};
	},

	handleSetAsDefaultErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.setAsDefault = false;
		this.safeSetState(accessorObject);
	},

	handleRemoveErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.remove = false;
		this.safeSetState(accessorObject);
	},

	handleSetAsDefaultClick () {
		call(this.props.showProgress);

		SettingsActions.changeDefaultAccount({
			id: this.props.account.id
		}, res => {
			call(this.props.hideProgress);

			let accessorObject = this.state;

			accessorObject.showErrorDialog.setAsDefault = res.success !== true;
			accessorObject.errorDialogErrorMessage.setAsDefault = res.errorMessage;

			this.safeSetState(accessorObject);
		});
	},

	handleRemoveClick () {
		call(this.props.showProgress);

		SettingsActions.removeAccount({
			id: this.props.account.id
		}, res => {
			call(this.props.hideProgress);

			let accessorObject = this.state;

			accessorObject.showErrorDialog.remove = res.success !== true;
			accessorObject.errorDialogErrorMessage.remove = res.errorMessage;

			//if (this.isMounted()) {	// might be already removed
				this.safeSetState(accessorObject);
			//}

			//console.log(res);
		});
	},

	handleEditClick () {
		//console.log(this.props.account);
		this.safeSetState({
			currentDialog: (
				<AddEditAccountDialog
					editMode={true}
					account={this.props.account}
					open={true}
					handleClose={this.handleEditAccountDialogClose}
				/>
			)
			//showEditAccountDialog: true
		});
	},

	handleEditAccountDialogClose () {
		this.safeSetState({
			currentDialog: null
			//showEditAccountDialog: false
		});
	},

	render () {
		let leftIcon;
		//if (this.state.showProgress) {
		//	leftIcon = (
		//		<TinyCircularProgress show={true}/>
		//	);
		//} else {
			leftIcon = this.props.isDefaultAccount ? (
				<span className="default-account">
					Default
				</span>
			) : null;
		//}

		const rightIconMenu = (
			<IconMenu
				iconButtonElement={
					<IconButton	touch={true}>
						<GreyMoreVertIcon/>
					</IconButton>
				}>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">mode_edit</FontIcon>
					}
					primaryText="Edit"
					onTouchTap={this.handleEditClick}
				/>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">done</FontIcon>
					}
					primaryText="Set as default"
					disabled={this.props.isDefaultAccount}
					onTouchTap={this.handleSetAsDefaultClick}
				/>
				<Divider/>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">delete</FontIcon>
					}
					primaryText="Remove"
					onTouchTap={this.handleRemoveClick}
				/>
			</IconMenu>
		);

		return (
			<ListItem
				primaryText={
					<div className="text-ellipsis">
						{this.props.account.fromName}
						<ErrorDialog
							open={this.state.showErrorDialog.setAsDefault}
							handleClose={this.handleSetAsDefaultErrorDialogClose}
							message="Setting default account failed"
							errorMessage={this.state.errorDialogErrorMessage.setAsDefault}
						/>
						<ErrorDialog
							open={this.state.showErrorDialog.remove}
							handleClose={this.handleRemoveErrorDialogClose}
							message="Removing account failed"
							errorMessage={this.state.errorDialogErrorMessage.remove}
						/>
						{this.state.currentDialog}
					</div>
				}
				secondaryText={
					<div className="text-ellipsis">
						{this.props.account.eMail}
					</div>
				}
				leftIcon={leftIcon}
				insetChildren={!this.props.isDefaultAccount}
				rightIconButton={rightIconMenu}
			/>
		);
	}
});