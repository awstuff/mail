const React = require("react");
const TitleBar = require("./title-bar/Index");
const PageContent = require("./page-content/Index");

module.exports = React.createClass({
	displayName: "RoutePage",

	render () {
		return (
			<section>
				<TitleBar hideMenusAndDrawer={this.props.hideMenusAndDrawer} hideDrawer={this.props.hideDrawer} />
				<PageContent drawerCannotOpen={this.props.hideMenusAndDrawer || this.props.hideDrawer}>
					{this.props.children}
				</PageContent>
			</section>
		);
	}
});