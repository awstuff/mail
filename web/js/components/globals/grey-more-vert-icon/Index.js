const React = require("react");
const colors = require("material-ui/styles/colors");
const MoreVertIcon = require("material-ui/svg-icons/navigation/more-vert").default;

module.exports = React.createClass({
	displayName: "GreyMoreVertIcon",

	render () {
		return (
			<MoreVertIcon color={colors.grey500} />
		);
	}
});