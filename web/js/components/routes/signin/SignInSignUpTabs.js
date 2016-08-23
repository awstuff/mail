const React = require("react");
const Card = require("material-ui/Card").Card;
const CardText = require("material-ui/Card").CardText;
const Tabs = require("material-ui/Tabs").Tabs;
const Tab = require("material-ui/Tabs").Tab;
const SignInTab = require("./SignInTab");
const SignUpTab = require("./SignUpTab");

module.exports = React.createClass({
	displayName: "SignInSignUpTabs",

	render () {
		return (
			<Card>
				<CardText>
					<Tabs>
						<Tab label="Sign In">
							<SignInTab/>
						</Tab>
						<Tab label="New here? Join">
							<SignUpTab/>
						</Tab>
					</Tabs>
				</CardText>
			</Card>
		);
	}
});