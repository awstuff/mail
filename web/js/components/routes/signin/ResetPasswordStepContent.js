const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const UserActions = require("./../../../actions/UserActions");
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../config-values/genericTextFieldErrorText");
const eMailTextFieldErrorText = require("./../../../config-values/eMailTextFieldErrorText");
const validate = require("./../../../util/validate");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "ResetPasswordStepContent",

	mixins: [safeSetState],

	getInitialState () {
		return {
			stepIndex: 0,
			showProgress: false,
			showSuccessDialog: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			eMail: "",
			errorText: ""
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

	handleTextFieldChange (e) {
		this.safeSetState({
			eMail: e.target.value
		});
	},

	handleResetPasswordButtonClick () {
		if (!validate.stringNotEmpty(this.state.eMail)) {
			this.safeSetState({
				errorText: genericTextFieldErrorText
			});
			this.props.forceParentUpdate();
			return;
		}

		if (!validate.isValidEmail(this.state.eMail)) {
			this.safeSetState({
				errorText: eMailTextFieldErrorText
			});
			this.props.forceParentUpdate();
			return;
		}

		this.safeSetState({
			errorText: "",
			showProgress: true
		});
		this.props.forceParentUpdate();

		UserActions.resetPassword({
			eMail: this.state.eMail
		}, res => {
			this.safeSetState({
				showProgress: false,
				showErrorDialog: res.success !== true,
				showSuccessDialog: res.success === true,
				errorDialogErrorMessage: res.errorMessage ? res.errorMessage : ""
			});
			this.props.forceParentUpdate();
		});
	},

	render () {
		return (
			<div>
				<p>
					Don't worry, just enter your email address below and we'll send you a link to reset your password.
				</p>
				<TextField
					className="full-width-text-field"
					type="email"
					hintText="Email address"
					errorText={this.state.errorText}
					value={this.state.eMail}
					onChange={this.handleTextFieldChange}
				/>
				<div className="step-actions">
					<RaisedButton
						className="raised-button"
						label={"Send email"}
						secondary={true}
						onTouchTap={this.handleResetPasswordButtonClick}
					/>
				</div>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Sending reset password link failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog}
					handleClose={this.handleSuccessDialogClose}
					message="Sending email to reset password succeeded"
				/>
			</div>
		);
	}
});