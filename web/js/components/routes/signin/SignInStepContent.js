const _ = require("lodash");
const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const UserActions = require("./../../../actions/UserActions");
const ErrorDialog = require("./../../globals/dialogs/ErrorDialog");
const SmallCenteredCircularProgress = require("./../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../config-values/genericTextFieldErrorText");
const eMailTextFieldErrorText = require("./../../../config-values/eMailTextFieldErrorText");
const routePaths = require("./../../../config-values/routePaths");
const validate = require("./../../../util/validate");
const navigation = require("./../../../util/navigation");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "SignInStepContent",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: false,
			data: {
				eMail: "",
				password: "",
				passphrase: ""
			},
			errorText: {
				eMail: "",
				password: "",
				passphrase: ""
			}
		}
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleEmailTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.eMail = e.target.value;

		this.safeSetState(accessorObject);
	},

	handlePasswordTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.password = e.target.value;

		this.safeSetState(accessorObject);
	},

	handlePassphraseTextFieldChange (e) {
		let accessorObject = this.state;
		accessorObject.data.passphrase = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleSignInButtonClick () {
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
			this.props.forceParentUpdate();
			return;
		}

		if (!validate.isValidEmail(this.state.data.eMail)) {
			accessorObject.errorText.eMail = eMailTextFieldErrorText;
			this.safeSetState(accessorObject);
			this.props.forceParentUpdate();
			return;
		}

		accessorObject.showProgress = true;

		UserActions.loginUser(this.state.data, res => {
			this.safeSetState({
				showProgress: false,
				showErrorDialog: res.success !== true
			});

			this.props.forceParentUpdate();

			if (res.success === true) {
				navigation.goto(routePaths.home);
			}
		});

		this.safeSetState(accessorObject);
		this.props.forceParentUpdate();
	},

	render () {
		return (
			<div>
				<p>
					Enter your login data below.
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
					errorText={this.state.errorText.password}
					value={this.state.data.password}
					onChange={this.handlePasswordTextFieldChange}
				/>
				<TextField
					className="full-width-text-field"
					type="password"
					hintText="Encryption passphrase"
					errorText={this.state.errorText.passphrase}
					value={this.state.data.passphrase}
					onChange={this.handlePassphraseTextFieldChange}
				/>
				<div className="step-actions">
					<RaisedButton
						className="raised-button"
						label={"Sign in"}
						secondary={true}
						onTouchTap={this.handleSignInButtonClick}
					/>
				</div>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Signing in failed"
					errorMessage="Email address or password incorrect"
				/>
			</div>
		);
	}
});