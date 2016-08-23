const React = require("react");
const Card = require("material-ui/Card").Card;
const CardText = require("material-ui/Card").CardText;

module.exports = React.createClass({
	displayName: "SettingsSection",

	render () {
		return (
			<div className="settings-section row center-lg center-md center-sm center-xs">
				<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
					<Card>
						<CardText>
							{this.props.headline ? <h1 className="headline">{this.props.headline}</h1> : null}
							{this.props.children}
						</CardText>
					</Card>
				</div>
			</div>
		);
	}
});