const React = require("react");
const CircularProgress = require("material-ui/CircularProgress").default;

module.exports = React.createClass({
	displayName: "BigCenteredCircularProgress",
	
	render () {
		if (!this.props.show) {
			return null;
		}

		return (
			<div className={"centered " + this.props.className}>
				<CircularProgress size={1} />
			</div>
		);
	}
});