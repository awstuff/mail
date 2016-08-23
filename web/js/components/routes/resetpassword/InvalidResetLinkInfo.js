const React = require("react");
const GoToMainPageLink = require("./../../globals/go-to-main-page-link/Index");
const errorDialogTitle = require("./../../../config-values/errorDialogTitle");

module.exports = React.createClass({
	displayName: "InvalidResetLinkInfo",

	render () {
		return (
			<div>
				<h1 className="headline-huge">{errorDialogTitle}</h1>
				<p>Unfortunately, this link is invalid and cannot be used to reset your password.</p>
				<p>It may have already expired (password reset links are only valid for 2 days), or somebody already used it.</p>
				<p>
					<GoToMainPageLink/>
				</p>
			</div>
		);
	}
});