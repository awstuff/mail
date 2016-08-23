const _ = require("lodash");
const React = require("react");
const Stepper = require("material-ui/Stepper").Stepper;
const Step = require("material-ui/Stepper").Step;
const StepLabel = require("material-ui/Stepper").StepLabel;
const StepContent = require("material-ui/Stepper").StepContent;
const RaisedButton = require("material-ui/RaisedButton").default;
const FlatButton = require("material-ui/FlatButton").default;
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

const steps = {
	eMail: 0,
	password: 1,
	passphrase: 2
};
const stepsInverted = _.invert(steps);	// keys become values, values become keys

module.exports = React.createClass({
	displayName: "SignUpTab",

	mixins: [safeSetState],

	getInitialState () {
		return {
			stepIndex: 0,
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
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

	handleTextFieldChange (e) {
		if (this.state.stepIndex < steps.eMail || this.state.stepIndex > steps.passphrase) {
			console.error("Sign up: Step index " + this.state.stepIndex + " is out of bounds.");
			return;
		}

		let accessorObject = this.state;
		accessorObject.data[stepsInverted[this.state.stepIndex]] = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleNext () {
		let currentStepKey = stepsInverted[this.state.stepIndex];
		let accessorObject = this.state;

		_.forEach(accessorObject.errorText, (val, key) => {	// reset the entire object. For some reason _.map does not work here
			accessorObject.errorText[key] = "";
		});

		if (!validate.stringNotEmpty(this.state.data[currentStepKey])) {	// empty value
			accessorObject.errorText[currentStepKey] = genericTextFieldErrorText;
			this.safeSetState(accessorObject);
			return;
		}

		if (this.state.stepIndex === steps.eMail && !validate.isValidEmail(this.state.data.eMail)) {
			accessorObject.errorText[currentStepKey] = eMailTextFieldErrorText;
			this.safeSetState(accessorObject);
			return;
		}

		accessorObject.stepIndex = this.state.stepIndex + 1;

		if (this.state.stepIndex > steps.passphrase) {	// state object was not cloned, so the incrementation is already visible
			accessorObject.showProgress = true;

			UserActions.registerUser(this.state.data, res => {
				this.safeSetState({
					showProgress: false,
					showErrorDialog: res.success !== true,
					errorDialogErrorMessage: res.errorMessage ? res.errorMessage : ""
				});

				if (res.success === true) {
					navigation.goto(routePaths.home);
					alert("well this should be a nice introductory message");
				}
			});
		}

		this.safeSetState(accessorObject);
	},

	handlePrev () {
		if (this.state.stepIndex > steps.eMail) {
			this.safeSetState({
				stepIndex: this.state.stepIndex - 1
			});
		}
	},

	renderStepActions (step) {
		return (
			<div className="step-actions">
				<RaisedButton
					className="raised-button raised-button-margin-right"
					label={step === steps.passphrase ? "Let's get started!" : "Next"}
					secondary={true}
					onTouchTap={this.handleNext}
				/>
				{step > steps.eMail && (	// show only if step > steps.eMail
					<FlatButton
						label="Back"
						onTouchTap={this.handlePrev}
					/>
				)}
			</div>
		);
	},

	render () {
		return (
			<div className="sign-in-up-stepper">
				<Stepper activeStep={this.state.stepIndex} orientation="vertical">
					<Step>
						<StepLabel>Enter your email address</StepLabel>
						<StepContent>
							<p>
								This acts as your username.
							</p>
							<TextField
								className="full-width-text-field"
								type="email"
								hintText="Email address"
								errorText={this.state.errorText.eMail}
								value={this.state.data.eMail}
								onChange={this.handleTextFieldChange}
							/>
							{this.renderStepActions(steps.eMail)}
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Choose a password</StepLabel>
						<StepContent>
							<p>
								You can choose any password you want.
							</p>
							<TextField
								className="full-width-text-field"
								type="password"
								hintText="Password"
								errorText={this.state.errorText.password}
								value={this.state.data.password}
								onChange={this.handleTextFieldChange}
							/>
							{this.renderStepActions(steps.password)}
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Choose an encryption passphrase</StepLabel>
						<StepContent>
							<p>
								In order to protect your privacy, the passwords of your email accounts will be encypted. To make this possible, you need to choose an arbitrary passphrase for the encryption. For security reasons, we do not store this on our servers, so make sure you memorize it!
							</p>
							<TextField
								className="full-width-text-field"
								type="password"
								hintText="Encryption passphrase"
								errorText={this.state.errorText.passphrase}
								value={this.state.data.passphrase}
								onChange={this.handleTextFieldChange}
							/>
							{this.renderStepActions(steps.passphrase)}
						</StepContent>
					</Step>
				</Stepper>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Registration failed" errorMessage={this.state.errorDialogErrorMessage}
				/>
			</div>
		);
	}
});