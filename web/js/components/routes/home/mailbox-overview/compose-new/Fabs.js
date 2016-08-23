//const $ = require("jquery");
const React = require("react");
//const ReactDOM = require("react-dom");
const FloatingActionButton = require("material-ui/FloatingActionButton").default;
const FontIcon = require("material-ui/FontIcon").default;
const safeSetState = require("./../../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "Fabs",

	mixins: [safeSetState],

	//componentDidMount () {
	//	var $this = $(ReactDOM.findDOMNode(this));
	//
	//	setTimeout(function () {console.log("there");
	//		$this
	//			.find(".compose-new-fab")
	//			.children("button")
	//			.css("width", 0)
	//			.animate({
	//				width: 56
	//			}, 1500, function () {
	//				console.log("here");
	//				$this.removeClass("hidden-fabs");
	//			});
	//	}, 3500);
	//},

	render () {
		let draftFab;

		if (false) {
			draftFab = (
				<FloatingActionButton
					className="compose-new-fab pick-up-draft"
					title="Pick up draft"
				>
					<FontIcon className="material-icons">restore</FontIcon>
				</FloatingActionButton>
			);
		} else {
			draftFab = null;
		}

		return (
			<div className="compose-new-fabs">
				{draftFab}
				<FloatingActionButton
					className="compose-new-fab create-new"
					title="Write new email"
					secondary={true}
				>
					<FontIcon className="material-icons">create</FontIcon>
				</FloatingActionButton>
			</div>
		);
	}
});