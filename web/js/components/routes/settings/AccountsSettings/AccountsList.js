const _ = require("lodash");
const React = require("react");
const List = require("material-ui/List").List;
const AccountsListItem = require("./AccountsListItem");

module.exports = React.createClass({
	displayName: "AccountsList",

	render () {
		return (
			<List className="accounts-list">
				{
					_.map(this.props.accounts, (account, index) => {
						let isDefaultAccount;
						if (this.props.defaultAccount > 0) {	// there is a default account
							isDefaultAccount = this.props.defaultAccount === account.id;
						} else {
							isDefaultAccount = index === 0;	// simply select the first one as default
						}

						return (
							<AccountsListItem
								account={account}
								isDefaultAccount={isDefaultAccount}
								key={index}
								showProgress={this.props.showProgress}
								hideProgress={this.props.hideProgress}
							/>
						);
					})
				}
			</List>
		);
	}
});