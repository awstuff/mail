const _ = require("lodash");
const React = require("react");
const router = {
	Router: require("react-router/lib/Router"),
	Route: require("react-router/lib/Route"),
	useRouterHistory: require("react-router/lib/useRouterHistory")
};
const createHistory = require("history").createHistory;
const basename = require("./../config-values/basename");
const routerConfig = require("./../config-values/routerConfig");
const debugging = require("./../config-values/debugging");
const route404 = require("./routes/404/Index");
const RouteControllerView = require("./routes/RouteControllerView");
const navigation = require("./../util/navigation");
const validate = require("./../util/validate");
const UserActions = require("./../actions/UserActions");
const UserStore = require("./../stores/UserStore");

module.exports = React.createClass({
	displayName: "Routes",

	render () {
		let routeNodes = [];

		_.forEach(routerConfig, route => {
			routeNodes.push(
				<router.Route
					path={route.path}
					component={RouteControllerView}
					theRealComponent={route.component}
					redirectToAfterLoginWithToken={route.redirectToAfterLoginWithToken}
					isPublicAndRequiresNoLogin={route.isPublicAndRequiresNoLogin}
					key={route.path}
				/>
			);
		});

		routeNodes.push(
			<router.Route
				path="/*"
				component={RouteControllerView}
				theRealComponent={route404}
				isPublicAndRequiresNoLogin={true}
				key={"/*"}
			/>
		);

		const customHistory = router.useRouterHistory(createHistory)({
			basename
		});

		navigation.setHistory(customHistory);

		return (
			<section>
				<router.Router history={customHistory}>
					{routeNodes}
				</router.Router>
			</section>
		);
	}
});