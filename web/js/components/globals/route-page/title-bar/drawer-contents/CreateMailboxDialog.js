const React = require("react");
const Dialog = require("material-ui/Dialog").default;
const FlatButton = require("material-ui/FlatButton").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../../../globals/dialogs/ErrorDialog");
const SmallCenteredCircularProgress = require("./../../../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../../../config-values/genericTextFieldErrorText");
const call = require("./../../../../../util/call");
const validate = require("./../../../../../util/validate");
const safeSetState = require("./../../../../../util/safeSetState");
const AccountActions = require("./../../../../../actions/AccountActions");

module.exports = React.createClass({
	displayName: "CreateMailboxDialog",

	mixins: [safeSetState],

	getInitialState () {
		return {
			open: true,
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			data: {
				name : ""
			},
			errorText: {
				name: ""
			}
		}
	},

	handleNameTextFieldChange (e) {
		this.safeSetState({
			data: {
				name: e.target.value
			}
		});
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleCreateButtonClick () {
		if (!validate.stringNotEmpty(this.state.data.name)) {
			this.safeSetState({
				errorText: {
					name: genericTextFieldErrorText
				}
			});
			return;
		}

		this.safeSetState({
			showProgress: true
		});

		AccountActions.createMailbox({
			name: this.state.data.name,
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
				label="Create"
				primary={true}
				onTouchTap={this.handleCreateButtonClick}
			/>
		];

		return (
			<Dialog
				title="Create new mailbox"
				actions={actions}
				modal={true}
				open={this.props.open}
			>
				<TextField
					className="full-width-text-field"
					hintText="Name"
					errorText={this.state.errorText.name}
					value={this.state.data.name}
					onChange={this.handleNameTextFieldChange}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress} />
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Creating mailbox failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
			</Dialog>
		);
	}
});