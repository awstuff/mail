const React = require("react");
const safeSetState = require("./../../../../../util/safeSetState");
const Fabs = require("./Fabs");

module.exports = React.createClass({
	displayName: "ComposeNew",

	mixins: [safeSetState],

	render () {
		return (
			<div>
				<Fabs/>
			</div>
		);
	}
});