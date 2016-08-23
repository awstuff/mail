const _ = require("lodash");
const React = require("react");
const MenuItem = require("material-ui/MenuItem").default;
const FontIcon = require("material-ui/FontIcon").default;
const List = require("material-ui/List").List;
const AccountActions = require("./../../../../../actions/AccountActions");
const AccountStore = require("./../../../../../stores/AccountStore");
const MailboxActions = require("./../../../../../actions/MailboxActions");
const UserStore = require("./../../../../../stores/UserStore");
const safeSetState = require("./../../../../../util/safeSetState");
const navigation = require("./../../../../../util/navigation");
const routePaths = require("./../../../../../config-values/routePaths");
const SmallCenteredCircularProgress = require("./../../../circular-progress/SmallCentered");
const ErrorDialog = require("./../../../dialogs/ErrorDialog");
const AccountEntry = require("./AccountEntry");

//let firstFetchIsDone = false;

module.exports = React.createClass({
	displayName: "DrawerContents",

	mixins: [safeSetState],

	getInitialState () {
		return {
			showProgress: false,
			showErrorDialog: false,
			accounts: AccountStore.getAccounts()
		};
	},


	componentDidMount () {
		//firstFetchIsDone = false;	// reset on every new mount

		AccountStore.addChangeListener(this.onStoreStateChange);
		UserStore.addLoginListener(this.onUserLogin);
	},

	componentWillUnmount () {
		AccountStore.removeChangeListener(this.onStoreStateChange);
	},

	onUserLogin () {
		this.safeSetState({
			showProgress: true
		});

		AccountActions.getAll(success => {
			this.safeSetState({
				showProgress: false
			});

			if (success !== true) {
				UserStore.logoutUser();
				navigation.goto(routePaths.signIn);
			}
		});
	},

	onStoreStateChange () {
		this.safeSetState({
			accounts: AccountStore.getAccounts()
		}, () => {
			if (!AccountStore.firstFetchIsDone) {
				AccountStore.firstFetchIsDone = true;

				if (this.state.accounts && this.state.accounts.length > 0) {
					let firstAccount = this.state.accounts[0];

					if (firstAccount && firstAccount.mailboxes && firstAccount.mailboxes.length > 0) {
						MailboxActions.setCurrentMailbox({
							account: firstAccount.id,
							mailbox: firstAccount.mailboxes[0].name
						}, success => {
							if (success !== true) {
								this.safeSetState({
									showErrorDialog: true
								});
							}
						});
					}
				}
			}
		});
	},

	handleCreateAccountMenuItemClick () {
		navigation.goto(routePaths.settings);
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	render () {
		if (this.state.showProgress) {
			return (
				<SmallCenteredCircularProgress show={true} />
			);
		}

		if (this.state.accounts.length < 1) {
			return (
				<MenuItem
					leftIcon={
						<FontIcon className="material-icons">create</FontIcon>
					}
					onTouchTap={this.handleCreateAccountMenuItemClick}
				>
					Add an account
				</MenuItem>
			);
		}

		return (
			<div>
				<List>
					{
						_.map(this.state.accounts, account => {
							return (
								<AccountEntry
									account={account}
									key={account.id}
									toggleClose={this.props.toggleClose}
								/>
							);
						})
					}
				</List>
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Fetching emails failed"
				/>
			</div>
		);
	}
});