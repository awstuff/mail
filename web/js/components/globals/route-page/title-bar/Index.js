const React = require("react");
const AppBar = require("material-ui/AppBar").default;
const Drawer = require("material-ui/Drawer").default;
const Link = require("react-router/lib/Link");
const UserMenu = require("./UserMenu");
const PageTitleStore = require("./../../../../stores/PageTitleStore");
const windowSize = require("./../../../../util/windowSize");
const routePaths = require("./../../../../config-values/routePaths");
const safeSetState = require("./../../../../util/safeSetState");
const DrawerContents = require("./drawer-contents/Index");

module.exports = React.createClass({
	displayName: "TitleBar",

	mixins: [safeSetState],

	getInitialState () {
		return {
			forceDrawerOpen: false,
			drawerOpen: false,
			title: PageTitleStore.getTitle()
		};
	},

	componentDidMount () {
		windowSize.addAndCallListener(this, () => {
			this.safeSetState({
				forceDrawerOpen: windowSize.isLargeDevice()	// open drawer on large devices
			});
		});

		PageTitleStore.addChangeListener(this.onStoreStateChange);
	},

	componentWillUnmount () {
		PageTitleStore.removeChangeListener(this.onStoreStateChange);
	},

	onStoreStateChange () {
		this.safeSetState({
			title: PageTitleStore.getTitle()
		});
	},

	toggleClose () {
		if (this.state.forceDrawerOpen) {
			return;
		}

		this.safeSetState({
			drawerOpen: !this.state.drawerOpen
		});
	},

	render () {
		let userMenu;
		if (this.props.hideMenusAndDrawer === true) {
			userMenu = null;
		} else {
			userMenu = (
				<UserMenu/>
			);
		}

		return (
			<div>
				<AppBar
					className="title-bar"
					title={
						<Link to={routePaths.home}>{this.state.title}</Link>
					}
					iconElementRight={userMenu}
					showMenuIconButton={this.props.hideMenusAndDrawer !== true && this.props.hideDrawer !== true}
					onLeftIconButtonTouchTap={this.toggleClose}
				/>
				<Drawer
					className="title-bar-drawer"
					docked={this.state.forceDrawerOpen}
					open={(this.state.forceDrawerOpen || this.state.drawerOpen) && this.props.hideMenusAndDrawer !== true && this.props.hideDrawer !== true}
					onRequestChange={open => this.safeSetState({
						drawerOpen: open
					})}
				>
					<DrawerContents toggleClose={this.toggleClose} />
				</Drawer>
			</div>
		);
	}
});