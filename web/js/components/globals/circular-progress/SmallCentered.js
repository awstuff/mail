const React = require("react");
const CircularProgress = require("material-ui/CircularProgress").default;

module.exports = React.createClass({
	displayName: "SmallCenteredCircularProgress",
	
	render () {
		if (!this.props.show) {
			return null;
		}

		return (
			<div className="centered small-centered-circular-progress">
				<CircularProgress size={0.625} />
			</div>
		);
	}
});