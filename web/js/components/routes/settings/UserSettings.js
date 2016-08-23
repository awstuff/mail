const _ = require("lodash");
const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../config-values/genericTextFieldErrorText");
const validate = require("./../../../util/validate");
const SettingsActions = require("./../../../actions/SettingsActions");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "UserSettings",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			showSuccessDialog: false,
			data: {
				oldPassword: "",
				newPassword: ""
			},
			errorText: {
				oldPassword: "",
				newPassword: ""
			}
		}
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleSuccessDialogClose () {
		this.safeSetState({
			showSuccessDialog: false
		});
	},

	handleOldPasswordTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.oldPassword = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleNewPasswordTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.newPassword = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleSetNewPasswordButtonClick () {
		let accessorObject = this.state;

		_.forEach(accessorObject.errorText, (val, key) => {	// reset the entire object. For some reason _.map does not work here
			accessorObject.errorText[key] = "";
		});

		let validationError = false;
		_.forEach(this.state.data, (val, key) => {
			if (!validate.stringNotEmpty(val)) {
				accessorObject.errorText[key] = genericTextFieldErrorText;
				validationError = true;
			}
		});
		if (validationError) {
			this.safeSetState(accessorObject);
			return;
		}

		accessorObject.showProgress = true;

		SettingsActions.changePassword(this.state.data, res => {
			this.safeSetState({
				showProgress: false,
				showErrorDialog: res.success !== true,
				errorDialogErrorMessage: res.errorMessage,
				showSuccessDialog: res.success === true
			});
		});

		this.safeSetState(accessorObject);
	},

	render () {
		return (
			<div>
				<p>
					Simply enter your current password and your new password of choice below.
				</p>
				<TextField
					className="full-width-text-field"
					type="password"
					hintText="Current password"
					errorText={this.state.errorText.oldPassword}
					value={this.state.data.oldPassword}
					onChange={this.handleOldPasswordTextFieldChange}
				/>
				<TextField
					className="full-width-text-field"
					type="password"
					hintText="New password"
					errorText={this.state.errorText.newPassword}
					value={this.state.data.newPassword}
					onChange={this.handleNewPasswordTextFieldChange}
				/>
				<RaisedButton
					className="raised-button"
					label={"Set new password"}
					secondary={true}
					onTouchTap={this.handleSetNewPasswordButtonClick}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Changing your password failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog}
					handleClose={this.handleSuccessDialogClose}
					message="Your new password was set successfully."
				/>
			</div>
		);
	}
});