const React = require("react");
const safeSetState = require("./../../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "ControlBar",

	mixins: [safeSetState],

	render () {
		// pager und später vielleicht suchfeld + anzahl emails ausgeben
		return (
			<div></div>
		);
	}
});