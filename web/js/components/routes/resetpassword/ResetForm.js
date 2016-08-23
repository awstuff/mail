const _ = require("lodash");
const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const GoToMainPageLink = require("./../../globals/go-to-main-page-link/Index");
const UserActions = require("./../../../actions/UserActions");
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../config-values/genericTextFieldErrorText");
const eMailTextFieldErrorText = require("./../../../config-values/eMailTextFieldErrorText");
const validate = require("./../../../util/validate");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "ResetForm",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			showSuccessDialog: false,
			data: {
				eMail: "",
				newPassword: ""
			},
			errorText: {
				eMail: "",
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

	handleEmailTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.eMail = e.target.value;

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

		if (!validate.isValidEmail(this.state.data.eMail)) {
			accessorObject.errorText.eMail = eMailTextFieldErrorText;
			this.safeSetState(accessorObject);
			return;
		}

		accessorObject.showProgress = true;

		UserActions.setNewPassword({
			id: this.props.linkId,
			eMail: this.state.data.eMail,
			newPassword: this.state.data.newPassword
		}, res => {
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
				<h1 className="headline-huge">Choose a new password</h1>
				<p>
					Simply enter your email address and your new password of choice below.
				</p>
				<TextField
					className="full-width-text-field"
					type="email"
					hintText="Email address"
					errorText={this.state.errorText.eMail}
					value={this.state.data.eMail}
					onChange={this.handleEmailTextFieldChange}
				/>
				<TextField
					className="full-width-text-field"
					type="password"
					hintText="Password"
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
				<p>
					<GoToMainPageLink/>
				</p>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Resetting your password failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog}
					handleClose={this.handleSuccessDialogClose}
					message="Your new password was set successfully. It is now ready for use!"
				/>
			</div>
		);
	}
});