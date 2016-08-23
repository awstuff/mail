const React = require("react");
const UserStore = require("./../../../stores/UserStore");
const SettingsActions = require("./../../../actions/SettingsActions");
const SettingsStore = require("./../../../stores/SettingsStore");
const RoutePage = require("./../../globals/route-page/Index");
const navigation = require("./../../../util/navigation");
const routePaths = require("./../../../config-values/routePaths");
const SettingsSection = require("./SettingsSection");
const UserSettings = require("./UserSettings");
const SignatureSettings = require("./SignatureSettings");
const AccountsSettings = require("./AccountsSettings/Index");
const ReplyHeaderSettings = require("./ReplyHeaderSettings");
const RecipientCacheSettings = require("./RecipientCacheSettings");
const BigCenteredCircularProgress = require("./../../globals/circular-progress/BigCentered");
const safeSetState = require("./../../../util/safeSetState");
const PageTitleStore = require("./../../../stores/PageTitleStore");

module.exports = React.createClass({
	displayName: "SettingsRoute",

	mixins: [safeSetState],

	getInitialState () {
		return {
			settings: SettingsStore.getSettings(),
			showProgress: true
		};
	},

	componentDidMount () {
		PageTitleStore.setTitle("Settings");

		SettingsStore.addChangeListener(this.onStoreStateChange);
		UserStore.addLoginListener(this.onUserLogin);
	},

	componentDidUpdate () {
		PageTitleStore.setTitle("Settings");
	},

	componentWillUnmount () {
		SettingsStore.removeChangeListener(this.onStoreStateChange);
		UserStore.removeLoginListener(this.onUserLogin);
	},

	onStoreStateChange () {
		this.safeSetState({
			settings: SettingsStore.getSettings()
		});
	},

	onUserLogin () {
		this.safeSetState({
			showProgress: true
		});

		SettingsActions.loadSettings(success => {
			this.safeSetState({
				showProgress: false
			});

			if (success !== true) {
				UserStore.logoutUser();
				navigation.goto(routePaths.signIn);
			}
		});
	},

	render () {
		let contents;

		if (this.state.showProgress) {

			contents = (
				<SettingsSection>
					<BigCenteredCircularProgress show={this.state.showProgress} />
				</SettingsSection>
			);

		} else {

			contents = [];	// we need to push multiple nodes onto it

			contents.push(
				<SettingsSection key="user-settings" headline="Change Password">
					<UserSettings/>
				</SettingsSection>
			);

			contents.push(
				<SettingsSection key="signature-settings" headline="Change Signature">
					<SignatureSettings globalSignature={this.state.settings.globalSignature} />
				</SettingsSection>
			);

			contents.push(
				<SettingsSection key="accounts-settings" headline="Configure Email Accounts">
					<AccountsSettings accounts={this.state.settings.accounts} defaultAccount={+this.state.settings.defaultAccount} />
				</SettingsSection>
			);

			contents.push(
				<SettingsSection key="reply-header-settings" headline="Change Reply Header">
					<ReplyHeaderSettings replyHeader={this.state.settings.replyHeader} />
				</SettingsSection>
			);

			contents.push(
				<SettingsSection key="recipient-cache-settings" headline="Configure Recipient History">
					<RecipientCacheSettings enabled={this.state.settings.recipientCacheIsEnabled} />
				</SettingsSection>
			);

		}

		return (
			<RoutePage hideDrawer={true}>
				{contents}
			</RoutePage>
		);
	}
});