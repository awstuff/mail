const React = require("react");
const FontIcon = require("material-ui/FontIcon").default;

module.exports = React.createClass({
	displayName: "NoMessagesNotification",

	render () {
		return (
			<div className="no-messages text-muted">
				<div>
					<FontIcon className="material-icons">mail_outline</FontIcon>
					<h1>
						There are no emails here!
					</h1>
				</div>
			</div>
		);
	}
});