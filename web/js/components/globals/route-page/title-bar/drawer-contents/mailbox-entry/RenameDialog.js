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
	displayName: "RenameDialog",

	mixins: [safeSetState],

	getInitialState () {
		return {
			open: true,
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			data: {
				newName: this.props.oldName
			},
			errorText: {
				newName: ""
			}
		}
	},

	handleNewNameTextFieldChange (e) {
		this.safeSetState({
			data: {
				newName: e.target.value
			}
		});
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleRenameButtonClick () {
		if (!validate.stringNotEmpty(this.state.data.newName)) {
			this.safeSetState({
				errorText: {
					newName: genericTextFieldErrorText
				}
			});
			return;
		}

		this.safeSetState({
			showProgress: true
		});

		AccountActions.renameMailbox({
			newName: this.state.data.newName,
			oldName: this.props.oldName,
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
				label="Rename"
				primary={true}
				onTouchTap={this.handleRenameButtonClick}
			/>
		];

		return (
			<Dialog
				title={"Rename mailbox '" + this.props.oldName + "'"}
				actions={actions}
				modal={true}
				open={this.props.open}
			>
				<TextField
					className="full-width-text-field"
					hintText="Name"
					errorText={this.state.errorText.newName}
					value={this.state.data.newName}
					onChange={this.handleNewNameTextFieldChange}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress} />
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Renaming mailbox failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
			</Dialog>
		);
	}
});