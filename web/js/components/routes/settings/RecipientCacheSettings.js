const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const FlatButton = require("material-ui/FlatButton").default;
const Toggle = require("material-ui/Toggle").default;
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SuccessDialog = require("./../../globals/dialogs/SuccessDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const SettingsActions = require("./../../../actions/SettingsActions");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "RecipientCacheSettings",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: {
				save: false,
				clear: false
			},
			errorDialogErrorMessage: {
				save: "",
				clear: ""
			},
			showSuccessDialog: {
				save: false,
				clear: false
			},
			data: {
				enabled: this.props.enabled
			}
		}
	},

	handleSaveErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.save = false;
		this.safeSetState(accessorObject);
	},

	handleSaveSuccessDialogClose () {
		let accessorObject = this.state;

		accessorObject.showSuccessDialog.save = false;
		this.safeSetState(accessorObject);
	},

	handleClearErrorDialogClose () {
		let accessorObject = this.state;

		accessorObject.showErrorDialog.clear = false;
		this.safeSetState(accessorObject);
	},

	handleClearSuccessDialogClose () {
		let accessorObject = this.state;

		accessorObject.showSuccessDialog.clear = false;
		this.safeSetState(accessorObject);
	},

	handleEnabledToggle (e) {
		this.safeSetState({
			data: {
				enabled: e.target.checked
			}
		});
	},

	handleSaveConfigurationButtonClick () {
		let accessorObject = this.state;

		accessorObject.showProgress = true;

		SettingsActions.setRecipientCacheEnabled(this.state.data, res => {
			accessorObject = this.state;

			accessorObject.showProgress = false;
			accessorObject.showErrorDialog.save = res.success !== true;
			accessorObject.errorDialogErrorMessage.save = res.errorMessage;
			accessorObject.showSuccessDialog.save = res.success === true;

			this.safeSetState(accessorObject);
		});

		this.safeSetState(accessorObject);
	},

	handleClearButtonClick () {
		let accessorObject = this.state;

		accessorObject.showProgress = true;

		SettingsActions.clearRecipientCache(res => {
			accessorObject = this.state;

			accessorObject.showProgress = false;
			accessorObject.showErrorDialog.clear = res.success !== true;
			accessorObject.errorDialogErrorMessage.clear = res.errorMessage;
			accessorObject.showSuccessDialog.clear = res.success === true;

			this.safeSetState(accessorObject);
		});

		this.safeSetState(accessorObject);
	},

	render () {
		return (
			<div>
				<p>
					By default, we store the email address of every recipient you send an email to. This allows us to suggest recipients when you're composing a new email. You can enable or disable this feature here, or clear the recipient history saved until this point.
				</p>
				<Toggle
					className="no-full-width"
					label="Enable storing of recipients"
					defaultToggled={this.state.data.enabled}
					onToggle={this.handleEnabledToggle}
				/>
				<RaisedButton
					className="raised-button raised-button-margin-right"
					label={"Save configuration"}
					secondary={true}
					onTouchTap={this.handleSaveConfigurationButtonClick}
				/>
				<FlatButton
					label={"Clear history"}
					onTouchTap={this.handleClearButtonClick}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress} />
				<ErrorDialog
					open={this.state.showErrorDialog.save}
					handleClose={this.handleSaveErrorDialogClose}
					message="Saving your configuration failed"
					errorMessage={this.state.errorDialogErrorMessage.save}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog.save}
					handleClose={this.handleSaveSuccessDialogClose}
					message="Your configuration was saved successfully."
				/>
				<ErrorDialog
					open={this.state.showErrorDialog.clear}
					handleClose={this.handleClearErrorDialogClose}
					message="Clearing your recipient history failed"
					errorMessage={this.state.errorDialogErrorMessage.clear}
				/>
				<SuccessDialog
					open={this.state.showSuccessDialog.clear}
					handleClose={this.handleClearSuccessDialogClose}
					message="Your recipient history was cleared successfully."
				/>
			</div>
		);
	}
});