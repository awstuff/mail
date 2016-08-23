const React = require("react");
const Stepper = require("material-ui/Stepper").Stepper;
const Step = require("material-ui/Stepper").Step;
const StepButton = require("material-ui/Stepper").StepButton;
const StepContent = require("material-ui/Stepper").StepContent;
const SignInStepContent = require("./SignInStepContent");
const ResetPasswordStepContent = require("./ResetPasswordStepContent");
const safeSetState = require("./../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "SignInTab",

	mixins: [safeSetState],

	getInitialState () {
		return {
			stepIndex: 0
		}
	},

	forceUpdateFromBelow () {	// shitty hack, but necessary in order to update the stepper's height
		this.forceUpdate();
	},

	render () {
		return (
			<div className="sign-in-up-stepper">
				<Stepper activeStep={this.state.stepIndex} linear={false} orientation="vertical">
					<Step>
						<StepButton onClick={() => this.safeSetState({stepIndex: 0})}>
							Sign in with an existing account
						</StepButton>
						<StepContent>
							<SignInStepContent forceParentUpdate={this.forceUpdateFromBelow} />
						</StepContent>
					</Step>
					<Step>
						<StepButton onClick={() => this.safeSetState({stepIndex: 1})}>
							I forgot my password
						</StepButton>
						<StepContent>
							<ResetPasswordStepContent forceParentUpdate={this.forceUpdateFromBelow} />
						</StepContent>
					</Step>
				</Stepper>
			</div>
		);
	}
});