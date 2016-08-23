const React = require("react");
const Dialog = require("material-ui/Dialog").default;
const FlatButton = require("material-ui/FlatButton").default;
const successDialogTitle = require("./../../../config-values/successDialogTitle");

module.exports = React.createClass({
	displayName: "SuccessDialog",

	render() {
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onTouchTap={this.props.handleClose}
			/>
		];

		return (
			<Dialog
				title={successDialogTitle}
				actions={actions}
				modal={true}
				open={this.props.open}
			>
				{this.props.message}
			</Dialog>
		);
	}
});