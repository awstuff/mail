const React = require("react");
const CircularProgress = require("material-ui/CircularProgress").default;

module.exports = React.createClass({
	displayName: "TinyCircularProgress",

	render () {
		if (!this.props.show) {
			return null;
		}

		return (
			<CircularProgress size={0.45} />
		);
	}
});