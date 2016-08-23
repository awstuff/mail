const React = require("react");
const Link = require("react-router/lib/Link");
const goToMainPageLinkText = require("./../../../config-values/goToMainPageLinkText");
const routePaths = require("./../../../config-values/routePaths");

module.exports = React.createClass({
	displayName: "GoToMainPageLink",

	render () {
		return (
			<Link to={routePaths.home}>{goToMainPageLinkText}</Link>
		);
	}
});