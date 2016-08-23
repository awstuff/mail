const React = require("react");
const MoreVertIcon = require("material-ui/svg-icons/navigation/more-vert").default;

module.exports = React.createClass({
	displayName: "NoAccountNotification",

	render () {
		return (
			<div className="no-account-notification text-muted">
				<div>
					<h1>No account yet?</h1>
					<span>Visit the settings via the <MoreVertIcon/> menu in the top right corner.</span>
				</div>
			</div>
		);
	}
});