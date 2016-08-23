const React = require("react");
const Dialog = require("material-ui/Dialog").default;
const FlatButton = require("material-ui/FlatButton").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../../../../globals/dialogs/ErrorDialog");
const SmallCenteredCircularProgress = require("./../../../../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../../../../config-values/genericTextFieldErrorText");
const call = require("./../../../../../../util/call");
const validate = require("./../../../../../../util/validate");
const safeSetState = require("./../../../../../../util/safeSetState");
const AccountActions = require("./../../../../../../actions/AccountActions");

module.exports = React.createClass({
	displayName: "DeleteDialog",

	mixins: [safeSetState],

	getInitialState () {
		return {
			open: true,
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: ""
		}
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleDeleteButtonClick () {
		this.safeSetState({
			showProgress: true
		});

		AccountActions.deleteMailbox({
			name: this.props.name,
			account: this.props.account
		}, res => {
			this.safeSetState({
				showProgress: false,
				showErrorDialog: res.success !== true,
				errorDialogErrorMessage: res.errorMessage
			});

			if (res.success === true) {	// close dialog if request was successful
				call(this.props.handleClose);
			}
		});
	},

	render() {
		const actions = [
			<FlatButton
				label="Abort"
				onTouchTap={this.props.handleClose}
			/>,
			<FlatButton
				label="Delete"
				primary={true}
				onTouchTap={this.handleDeleteButtonClick}
			/>
		];

		return (
			<Dialog
				title={"Do you really want to delete the mailbox '" + this.props.name + "'?"}
				actions={actions}
				modal={true}
				open={this.props.open}
			>
				<p>
					This cannot be undone.
				</p>
				<SmallCenteredCircularProgress show={this.state.showProgress} />
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Deleting mailbox failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
			</Dialog>
		);
	}
});