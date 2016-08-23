const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const FlatButton = require("material-ui/FlatButton").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../config-values/genericTextFieldErrorText");
const validate = require("./../../../util/validate");
const simpleDateTime = require("./../../../util/simpleDateTime");
const safeSetState = require("./../../../util/safeSetState");
const SettingsActions = require("./../../../actions/SettingsActions");

module.exports = React.createClass({
	displayName: "ReplyHeaderSettings",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: {
				set_: false,
				reset: false
			},
			errorDialogErrorMessage: {
				set_: "",
				reset: ""
			},
			showSuccessDialog: {
				set_: false,
				reset: false
			},
			data: {
				replyHeader: (validate.stringNotEmpty(this.props.replyHeader) ? this.props.replyHeader : "")
			},
			errorText: {
				replyHeader: ""
			}
		}
	},

	handleSetErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.set_ = false;
		this.safeSetState(accessorObject);
	},

	handleSetSuccessDialogClose () {
		let accessorObject = this.state;

		accessorObject.showSuccessDialog.set_ = false;
		this.safeSetState(accessorObject);
	},

	handleResetErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.reset = false;
		this.safeSetState(accessorObject);
	},

	handleResetSuccessDialogClose () {
		let accessorObject = this.state;

		accessorObject.showSuccessDialog.reset = false;
		this.safeSetState(accessorObject);
	},

	handleReplyHeaderTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.replyHeader = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleSetReplyHeaderButtonClick () {
		let accessorObject = this.state;

		accessorObject.errorText.replyHeader = "";

		if (!validate.stringNotEmpty(this.state.data.replyHeader)) {
			accessorObject.errorText.replyHeader = genericTextFieldErrorText;
			this.safeSetState(accessorObject);
			return;
		}

		accessorObject.showProgress = true;

		SettingsActions.changeReplyHeader(this.state.data, res => {
			accessorObject = this.state;

			accessorObject.showProgress = false;
			accessorObject.showErrorDialog.set_ = res.success !== true;
			accessorObject.errorDialogErrorMessage.set_ = res.errorMessage;
			accessorObject.showSuccessDialog.set_ = res.success === true;

			this.safeSetState(accessorObject);
		});

		this.safeSetState(accessorObject);
	},

	handleResetButtonClick () {
		let accessorObject = this.state;

		accessorObject.showProgress = true;

		SettingsActions.resetReplyHeader(res => {
			accessorObject = this.state;

			accessorObject.showProgress = false;
			accessorObject.showErrorDialog.reset = res.success !== true;
			accessorObject.errorDialogErrorMessage.reset = res.errorMessage;
			accessorObject.showSuccessDialog.reset = res.success === true;
			accessorObject.data.replyHeader = (validate.stringNotEmpty(this.props.replyHeader) ? this.props.replyHeader : "");

			this.safeSetState(accessorObject);
		});

		this.safeSetState(accessorObject);
	},

	render () {
		let currentDateTime = new Date();

		return (
			<div>
				<p>
					Your reply header is prepended to every reply you write to an email you received. You can customize it to fit your needs below. The following text variables will be automatically replaced by their current values:
				</p>
				<ul className="reply-header-text-vars-doc">
					<li>
						<span>$SENDER$</span>: The sender of the original email
					</li>
					<li>
						<span>$DATEEN$</span>: The original email's date and time in the following format: <span>{simpleDateTime(currentDateTime, "us", true)}</span>
					</li>
					<li>
						<span>$DATEDE$</span>: The original email's date and time in the following format: <span>{simpleDateTime(currentDateTime, "de", true)}</span>
					</li>
				</ul>
				<TextField
					className="full-width-text-field"
					hintText="Reply Header"
					errorText={this.state.errorText.replyHeader}
					value={this.state.data.replyHeader}
					onChange={this.handleReplyHeaderTextFieldChange}
				/>
				<RaisedButton
					className="raised-button raised-button-margin-right"
					label={"Set reply header"}
					secondary={true}
					onTouchTap={this.handleSetReplyHeaderButtonClick}
				/>
				<FlatButton
					label={"Reset to default"}
					onTouchTap={this.handleResetButtonClick}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog.set_}
					handleClose={this.handleSetErrorDialogClose}
					message="Setting your reply header failed"
					errorMessage={this.state.errorDialogErrorMessage.set_}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog.set_}
					handleClose={this.handleSetSuccessDialogClose}
					message="Your reply header was set successfully."
				/>
				<ErrorDialog
					open={this.state.showErrorDialog.reset}
					handleClose={this.handleResetErrorDialogClose}
					message="Resetting your reply header failed"
					errorMessage={this.state.errorDialogErrorMessage.reset}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog.reset}
					handleClose={this.handleResetSuccessDialogClose}
					message="Your reply header was reset successfully."
				/>
			</div>
		);
	}
});