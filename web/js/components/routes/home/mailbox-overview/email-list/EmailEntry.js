const React = require("react");
const ListItem = require("material-ui/List").ListItem;
const Avatar = require("material-ui/Avatar").default;
const FontIcon = require("material-ui/FontIcon").default;
const safeSetState = require("./../../../../../util/safeSetState");
const validate = require("./../../../../../util/validate");
const colors = require("./../../../../../config-values/colors");

module.exports = React.createClass({
	displayName: "EmailEntry",

	mixins: [safeSetState],

	render () {
		//date: "2016-06-18T03:13:36.000Z"
		//from: {
		//	address: "marketplace-messages@amazon.de"
		//	name: "Amazon.de Marketplace"
		//}
		//priority: "normal"
		//seen: false
		//subject: "ad29, möchten Sie Ihre Transaktion bei Amazon.de bewerten?"
		//to: [
		//	{
		//		address: "ad29@gmx.net"
		//		name: ""
		//	}
		//]
		//uid: 107313

		let avatarText;

		if (validate.stringNotEmpty(this.props.message.from.name)) {
			let fromNameSplit = this.props.message.from.name.split(" ");

			if (fromNameSplit.length > 1) {
				avatarText = fromNameSplit[0][0].toLocaleUpperCase() + fromNameSplit[1][0].toLocaleUpperCase();
			} else if (fromNameSplit.length === 1 && fromNameSplit[0].length > 0) {
				avatarText = fromNameSplit[0][0].toLocaleUpperCase();
			} else {	// this should actually never happen
				avatarText = this.props.message.from.address[0].toLocaleUpperCase();
			}
		} else {
			avatarText = this.props.message.from.address[0].toLocaleUpperCase();
		}


		//secondaryText={
		//	<div className="text-ellipsis">
		//		{this.props.account.eMail}
		//	</div>
		//}
		//

		return (
			<ListItem
				className="email-entry"
				primaryText={
					<div>
						<div className="text-ellipsis">
							{this.props.message.from.address}
						</div>
					</div>
				}
				leftAvatar={
					<Avatar
						className="avatar"
						backgroundColor={this.props.highlightColor}
					>
						{avatarText}
					</Avatar>
				}
			/>
		);
	}
});