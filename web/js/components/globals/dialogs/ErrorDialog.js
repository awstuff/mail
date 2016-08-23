const React = require("react");
const Dialog = require("material-ui/Dialog").default;
const FlatButton = require("material-ui/FlatButton").default;
const errorDialogTitle = require("./../../../config-values/errorDialogTitle");

module.exports = React.createClass({
	displayName: "ErrorDialog",

	render() {
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onTouchTap={this.props.handleClose}
			/>
		];

		let errorMessage = this.props.errorMessage ? ": " + this.props.errorMessage : null;

		return (
			<Dialog
				title={errorDialogTitle}
				actions={actions}
				modal={true}
				open={this.props.open}
			>
				{this.props.message}
				{errorMessage}
			</Dialog>
		);
	}
});