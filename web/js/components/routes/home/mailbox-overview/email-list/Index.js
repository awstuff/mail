const _ = require("lodash");
const React = require("react");
const List = require("material-ui/List").List;
const Card = require("material-ui/Card").Card;
const CardText = require("material-ui/Card").CardText;
const safeSetState = require("./../../../../../util/safeSetState");
const NoMessagesNotification = require("./NoMessagesNotification");
const EmailEntry = require("./EmailEntry");

module.exports = React.createClass({
	displayName: "EmailList",

	mixins: [safeSetState],

	render () {
		let contents;

		if (!this.props.eMails.messages || this.props.eMails.messages.length < 1) {

			contents = (
				<NoMessagesNotification/>
			);

		} else {

			let availableColors = [
				"red",
				"green",
				"blue",
				"yellow",
				"orange"
			];

			let colorsInUse = [];	// array for the already assigned colors
			let colorSenderMapping = {};

			let createRandomIndex = () => {
				return Math.floor(Math.random() * 5);
			};

			let obtainColor = (i, sender) => {
				console.log(sender);

				if (!colorsInUse[i]) {
					if (i === 0) {
						colorsInUse[i] = availableColors[createRandomIndex()];
					} else {
						do {
							colorsInUse[i] = availableColors[createRandomIndex()];
						} while(colorsInUse[i] === colorsInUse[i - 1]);	// two neighboring emails shall not have the same color
					}
				}
				return colorsInUse[i];
			};

			contents = (
				<Card>
					<CardText>
						<List>
							{
								_.map(this.props.eMails.messages, (message, index) => {
									console.log(index, message);

									return (
										<EmailEntry
											highlightColor={obtainColor(index, message.from.address)}
											message={message}
											key={message.uid}
										/>
									);
								})
							}
						</List>
					</CardText>
				</Card>
			);

		}


		return (
			<div className="email-list">
				{contents}
			</div>
		);
	}
});