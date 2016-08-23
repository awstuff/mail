const React = require("react");
const RaisedButton = require("material-ui/RaisedButton").default;
const AccountsList = require("./AccountsList");
const AddEditAccountDialog = require("./AddEditAccountDialog");
const SmallCenteredCircularProgress = require("./../../../globals/circular-progress/SmallCentered");
const safeSetState = require("./../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "AccountsSettings",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showAddAccountDialog: false,
			showProgress: false
		}
	},

	handleAddAccountButtonClick () {
		this.safeSetState({
			showAddAccountDialog: true
		});
	},

	handleAddAccountDialogClose () {
		this.safeSetState({
			showAddAccountDialog: false
		});
	},

	showProgress () {
		this.safeSetState({
			showProgress: true
		});
	},

	hideProgress () {
		this.safeSetState({
			showProgress: false
		});
	},

	render () {
		let contents;
		if (this.props.accounts.length > 0) {

			contents = (
				<div>
					<p>
						This is the list of the email accounts you have configured. You can add as many as you want, edit or delete existing ones and choose your default account.
					</p>
					<AccountsList
						accounts={this.props.accounts}
						defaultAccount={this.props.defaultAccount}
						showProgress={this.showProgress}
						hideProgress={this.hideProgress}
					/>
				</div>
			);

		} else {

			contents = (
				<div>
					<p>
						You have not configured any email accounts yet. Add one now!
					</p>
				</div>
			);

		}

		return (
			<div className="accounts-settings">
				{contents}
				<RaisedButton
					className="raised-button"
					label={"Add account"}
					secondary={true}
					onTouchTap={this.handleAddAccountButtonClick}
				/>
				<SmallCenteredCircularProgress show={this.state.showProgress}/>
				<AddEditAccountDialog
					editMode={false}
					open={this.state.showAddAccountDialog}
					handleClose={this.handleAddAccountDialogClose}
				/>
			</div>
		);
	}
});