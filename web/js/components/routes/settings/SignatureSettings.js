const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const validate = require("./../../../util/validate");
const SettingsActions = require("./../../../actions/SettingsActions");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "SignatureSettings",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			showSuccessDialog: false,
			data: {
				globalSignature: (validate.stringNotEmpty(this.props.globalSignature) ? this.props.globalSignature : "")
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

	handleGlobalSignatureTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.globalSignature = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleSetSignatureButtonClick () {
		let accessorObject = this.state;

		accessorObject.showProgress = true;

		SettingsActions.changeGlobalSignature(this.state.data, res => {
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
					Your signature is appended to every email you write.
				</p>
				<TextField
					className="full-width-text-field"
					multiLine={true}
					rows={2}
					hintText="Signature"
					value={this.state.data.globalSignature}
					onChange={this.handleGlobalSignatureTextFieldChange}
				/>
				<RaisedButton
					className="raised-button"
					label={"Set signature"}
					secondary={true}
					onTouchTap={this.handleSetSignatureButtonClick}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Setting your signature failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog}
					handleClose={this.handleSuccessDialogClose}
					message="Your signature was set successfully."
				/>
			</div>
		);
	}
});