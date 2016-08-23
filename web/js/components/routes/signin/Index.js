const React = require("react");
const RoutePage = require("./../../globals/route-page/Index");
const ImageSpinner = require("./ImageSpinner");
const SignInSignUpTabs = require("./SignInSignUpTabs");
const PageTitleStore = require("./../../../stores/PageTitleStore");

module.exports = React.createClass({
	displayName: "SignInRoute",

	componentDidMount () {
		PageTitleStore.resetTitle();
	},

	componentDidUpdate () {
		PageTitleStore.resetTitle();
	},

	render () {
		return (
			<RoutePage hideMenusAndDrawer={true}>
				<div className="row">
					<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
						<div className="box">
							<ImageSpinner/>
						</div>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
						<div className="box">
							<SignInSignUpTabs/>
						</div>
					</div>
				</div>
			</RoutePage>
		);
	}
});