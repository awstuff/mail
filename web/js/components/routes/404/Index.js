const React = require("react");
const Card = require("material-ui/Card").Card;
const CardText = require("material-ui/Card").CardText;
const RoutePage = require("./../../globals/route-page/Index");
const GoToMainPageLink = require("./../../globals/go-to-main-page-link/Index");
const errorDialogTitle = require("./../../../config-values/errorDialogTitle");
const PageTitleStore = require("./../../../stores/PageTitleStore");

module.exports = React.createClass({
	displayName: "404Route",

	componentDidMount () {
		PageTitleStore.setTitle("Page not found");
	},

	componentDidUpdate () {
		PageTitleStore.setTitle("Page not found");
	},

	render () {
		return (
			<RoutePage hideMenusAndDrawer={true}>
				<div className="row center-lg center-md center-sm center-xs">
					<div className="col-lg-4 col-md-6 col-sm-8 col-xs-12">
						<Card>
							<CardText>
								<div>
									<h1 className="headline-huge">{errorDialogTitle}: Error 404</h1>
									<p>There is nothing here. It seems like you clicked an invalid link.</p>
									<p>
										<GoToMainPageLink/>
									</p>
								</div>
							</CardText>
						</Card>
					</div>
				</div>
			</RoutePage>
		);
	}
});