const React = require("react");
const windowSize = require("./../../../../util/windowSize");
const safeSetState = require("./../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "PageContent",

	mixins: [safeSetState],

	componentDidMount () {
		windowSize.addAndCallListener(this, () => {
			if (windowSize.isLargeDevice() && this.props.drawerCannotOpen !== true) {
				this.safeSetState({
					className: " drawer-open"	// space character is important!
				});
			} else {
				this.safeSetState({
					className: ""
				});
			}
		});
	},

	getInitialState () {
		return {
			className: ""
		};
	},

	render () {
		return (
			<div className={"route-content" + this.state.className}>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
});