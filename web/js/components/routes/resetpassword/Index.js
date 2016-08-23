const React = require("react");
const Card = require("material-ui/Card").Card;
const CardText = require("material-ui/Card").CardText;
const RoutePage = require("./../../globals/route-page/Index");
const UserActions = require("./../../../actions/UserActions");
const navigation = require("./../../../util/navigation");
const InvalidResetLinkInfo = require("./InvalidResetLinkInfo");
const ResetForm = require("./ResetForm");
const BigCenteredCircularProgress = require("./../../globals/circular-progress/BigCentered");
const safeSetState = require("./../../../util/safeSetState");
const PageTitleStore = require("./../../../stores/PageTitleStore");

module.exports = React.createClass({
	displayName: "ResetPasswordRoute",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: true,
			displayError: false
		}
	},

	componentDidMount () {
		UserActions.verifyResetPasswordLink({
			id: this.props.params.id
		}, res => {
			this.safeSetState({
				showProgress: false,
				displayError: res.success !== true
			})
		});

		PageTitleStore.setTitle("Reset password");
	},

	componentDidUpdate () {
		PageTitleStore.setTitle("Reset password");
	},

	render () {
		let contents;

		if (this.state.showProgress) {
			contents = <BigCenteredCircularProgress show={this.state.showProgress} />;
		} else {
			if (this.state.displayError) {
				contents = <InvalidResetLinkInfo/>;
			} else {
				contents = <ResetForm linkId={this.props.params.id} />;
			}
		}

		return (
			<RoutePage hideMenusAndDrawer={true}>
				<div className="row center-lg center-md center-sm center-xs">
					<div className="col-lg-4 col-md-6 col-sm-8 col-xs-12">
						<Card>
							<CardText>
								{contents}
							</CardText>
						</Card>
					</div>
				</div>
			</RoutePage>
		);
	}
});