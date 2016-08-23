const React = require("react");
const IconMenu = require("material-ui/IconMenu").default;
const IconButton = require("material-ui/IconButton").default;
const MenuItem = require("material-ui/MenuItem").default;
const MoreVertIcon = require("material-ui/svg-icons/navigation/more-vert").default;
const FontIcon = require("material-ui/FontIcon").default;
const UserStore = require("./../../../../stores/UserStore");
const navigation = require("./../../../../util/navigation");
const routePaths = require("./../../../../config-values/routePaths");

module.exports = React.createClass({
	displayName: "UserMenu",

	handleSettingsMenuItemClick () {
		navigation.goto(routePaths.settings);
	},

	handleSignOutMenuItemClick () {
		UserStore.logoutUser();
		navigation.goto(routePaths.signIn);
	},

	render () {
		return (
			<IconMenu
				iconButtonElement={
					<IconButton>
						<MoreVertIcon className="title-bar-user-menu-icon"/>
					</IconButton>
				}
				targetOrigin={{
					horizontal: "right",
					vertical: "top"
				}}
				anchorOrigin={{
					horizontal: "right",
					vertical: "top"
				}}
			>
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">settings</FontIcon>
					}
					primaryText="Settings"
					onTouchTap={this.handleSettingsMenuItemClick}
				/>
				{/* <Divider/> */}
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">exit_to_app</FontIcon>
					}
					primaryText="Sign out"
					onTouchTap={this.handleSignOutMenuItemClick}
				/>
			</IconMenu>
		);
	}
});