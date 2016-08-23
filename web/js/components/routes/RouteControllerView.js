const React = require("react");
const UserActions = require("./../../actions/UserActions");
const UserStore = require("./../../stores/UserStore");
const navigation = require("./../../util/navigation");
const debugging = require("./../../config-values/debugging");
const routePaths = require("./../../config-values/routePaths");
const safeSetState = require("./../../util/safeSetState");

module.exports = React.createClass({
	displayName: "RouteControllerView",

	mixins: [safeSetState],

	getInitialState () {
		return {
			currentUser: UserStore.getCurrentUser(),
			loggedInBefore: false
		};
	},

	componentDidMount () {
		UserStore.addChangeListener(this.onStoreStateChange);

		this.doLogin();
	},

	doLogin () {
		if (this.props.route.isPublicAndRequiresNoLogin) {	// no need to login via token
			return;
		}

		UserActions.loginUserWithToken(success => {
			this.safeSetState({
				loggedInBefore: true
			});

			if (success === true) {	// automatic login succeeded. If a custom redirectUrl is set, redirect there, otherwise to nothing (aka stay on this page)

				if (this.props.route.redirectToAfterLoginWithToken) {
					navigation.goto(this.props.route.redirectToAfterLoginWithToken);
				}
			} else {	// automatic login failed, redirect to login page
				if (debugging) {
					console.warn("logging in with token failed, redirecting to login page");
				}

				UserStore.logoutUser();
				navigation.goto(routePaths.signIn);
			}
		});
	},

	componentDidUpdate () {
		if (!this.state.loggedInBefore && !this.props.route.isPublicAndRequiresNoLogin) {
			this.doLogin();
		}
	},

	componentWillUnmount () {
		UserStore.removeChangeListener(this.onStoreStateChange);
	},

	onStoreStateChange () {
		this.safeSetState({
			currentUser: UserStore.getCurrentUser()
		});
	},

	render () {
		//console.log("current user", this.state.currentUser);

		return (
			<this.props.route.theRealComponent currentUser={this.state.currentUser} params={this.props.params} />
		);
	}
});