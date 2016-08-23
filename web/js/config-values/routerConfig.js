const routePaths = require("./routePaths");

module.exports = {
	home: {
		path: routePaths.home,
		component: require("./../components/routes/home/Index"),
		name: "Home"
	},
	signIn: {
		path: routePaths.signIn,
		component: require("./../components/routes/signin/Index"),
		name: "Sign In",
		redirectToAfterLoginWithToken: routePaths.home
	},
	settings: {
		path: routePaths.settings,
		component: require("./../components/routes/settings/Index"),
		name: "Settings"
	},
	resetPassword: {
		path: routePaths.resetPassword,
		component: require("./../components/routes/resetpassword/Index"),
		name: "Reset Password",
		isPublicAndRequiresNoLogin: true
	}
};