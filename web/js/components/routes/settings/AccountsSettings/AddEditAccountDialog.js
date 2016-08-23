const _ = require("lodash");
const React = require("react");
const Dialog = require("material-ui/Dialog").default;
const FlatButton = require("material-ui/FlatButton").default;
const Toggle = require("material-ui/Toggle").default;
const TextField = require("material-ui/TextField").default;
const ErrorDialog = require("./../../../globals/dialogs/ErrorDialog");
const SmallCenteredCircularProgress = require("./../../../globals/circular-progress/SmallCentered");
const genericTextFieldErrorText = require("./../../../../config-values/genericTextFieldErrorText");
const eMailTextFieldErrorText = require("./../../../../config-values/eMailTextFieldErrorText");
const call = require("./../../../../util/call");
const validate = require("./../../../../util/validate");
const isNumber = require("./../../../../util/isNumber");
const SettingsActions = require("./../../../../actions/SettingsActions");
const safeSetState = require("./../../../../util/safeSetState");

module.exports = React.createClass({
	displayName: "AddEditAccountDialog",

	mixins: [safeSetState],

	getInitialState () {
		return {
			open: true,
			showProgress: false,
			showErrorDialog: false,
			errorDialogErrorMessage: "",
			data: {
				eMail: (this.props.editMode ? this.props.account.eMail : ""),
				fromName: (this.props.editMode ? this.props.account.fromName : ""),
				smtp: {
					port: (this.props.editMode ? this.props.account.smtp.port : ""),
					host: (this.props.editMode ? this.props.account.smtp.host : ""),
					userName: (this.props.editMode ? this.props.account.smtp.userName : ""),
					password: "",
					tls: (this.props.editMode ? this.props.account.smtp.tls : true)
				},
				imap: {
					port: (this.props.editMode ? this.props.account.imap.port : ""),
					host: (this.props.editMode ? this.props.account.imap.host : ""),
					userName: (this.props.editMode ? this.props.account.imap.userName : ""),
					password: "",
					tls: (this.props.editMode ? this.props.account.imap.tls : true)
				}
			},
			errorText: {
				eMail: "",
				fromName: "",
				smtp: {
					port: "",
					host: "",
					userName: "",
					password: ""
				},
				imap: {
					port: "",
					host: "",
					userName: "",
					password: ""
				}
			}
		}
	},

	handleTopLevelTextFieldChange (e, key) {
		let accessorObject = this.state;
		accessorObject.data[key] = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleSmtpTextFieldChange (e, key) {
		let accessorObject = this.state;
		accessorObject.data.smtp[key] = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleImapTextFieldChange (e, key) {
		let accessorObject = this.state;
		accessorObject.data.imap[key] = e.target.value;

		this.safeSetState(accessorObject);
	},

	handleEnableToggle (e, key) {
		let accessorObject = this.state;
		accessorObject.data[key].tls = e.target.checked;

		this.safeSetState(accessorObject);
	},

	handleErrorDialogClose () {
		this.safeSetState({
			showErrorDialog: false
		});
	},

	handleSaveButtonClick () {
		let accessorObject = this.state;

		accessorObject.errorText.eMail = accessorObject.errorText.fromName = "";
		_.forEach(accessorObject.errorText.smtp, (val, key) => {
			accessorObject.errorText.smtp[key] = "";
		});
		_.forEach(accessorObject.errorText.imap, (val, key) => {
			accessorObject.errorText.imap[key] = "";
		});
		let validationError = false;
		_.forEach(this.state.data, (val, key) => {
			if (!_.isObject(val) && !validate.stringNotEmpty(val)) {
				accessorObject.errorText[key] = genericTextFieldErrorText;
				validationError = true;
			}
		});
		_.forEach(this.state.data.smtp, (val, key) => {
			if (!_.isBoolean(val) && !isNumber(val) && !validate.stringNotEmpty(val)) {
				accessorObject.errorText.smtp[key] = genericTextFieldErrorText;
				validationError = true;
			}
		});
		_.forEach(this.state.data.imap, (val, key) => {
			if (!_.isBoolean(val) && !isNumber(val) && !validate.stringNotEmpty(val)) {
				accessorObject.errorText.imap[key] = genericTextFieldErrorText;
				validationError = true;
			}
		});
		if (validationError) {
			this.safeSetState(accessorObject);
			return;
		}

		if (!validate.isValidEmail(this.state.data.eMail)) {
			accessorObject.errorText.eMail = eMailTextFieldErrorText;
			this.safeSetState(accessorObject);
			return;
		}
		accessorObject.showProgress = true;

		let theFunctionToCall;
		if (this.props.editMode) {
			theFunctionToCall = SettingsActions.editAccount;
		} else {
			theFunctionToCall = SettingsActions.addAccount;
		}

		theFunctionToCall(Object.assign({}, this.state.data, {
			id: (this.props.editMode ? this.props.account.id : void 0)
		}), res => {
			accessorObject = this.state;

			accessorObject.showProgress = false;
			accessorObject.showErrorDialog = res.success !== true;
			accessorObject.errorDialogErrorMessage = res.errorMessage;

			this.safeSetState(accessorObject);

			if (res.success === true) {	// close dialog if request was successful
				call(this.props.handleClose);
			}
		});

		this.safeSetState(accessorObject);
	},

	render() {
		const actions = [
			<FlatButton
				label="Abort"
				onTouchTap={this.props.handleClose}
			/>,
			<FlatButton
				label="Save account"
				primary={true}
				onTouchTap={this.handleSaveButtonClick}
			/>
		];

		return (
			<Dialog
				className="add-account-dialog"
				title={this.props.editMode ? "Edit account" : "Add new account"}
				actions={actions}
				autoScrollBodyContent={true}
				modal={true}
				open={this.props.open}
			>
				<div className="row no-margin-after-child no-margin-after-me">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<h1 className="headline-smaller">General information</h1>
						<p>
							Enter the account's email address and your name here. The latter will appear as the email's sender in emails you send.
						</p>
					</div>
				</div>
				<div className="row no-margin-after-child">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Email address"
							errorText={this.state.errorText.eMail}
							value={this.state.data.eMail}
							onChange={e => {this.handleTopLevelTextFieldChange(e, "eMail")}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Name"
							errorText={this.state.errorText.fromName}
							value={this.state.data.fromName}
							onChange={e => {this.handleTopLevelTextFieldChange(e, "fromName")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child no-margin-after-me">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<h1 className="headline-smaller">Outbox server</h1>
						<p>
							Enter the account's outbox (SMTP) server configuration here. You can get this information from your email provider.
						</p>
					</div>
				</div>
				<div className="row no-margin-after-child no-margin-after-me">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Hostname"
							errorText={this.state.errorText.smtp.host}
							value={this.state.data.smtp.host}
							onChange={e => {this.handleSmtpTextFieldChange(e, "host")}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							type="number"
							hintText="Port number"
							errorText={this.state.errorText.smtp.port}
							value={this.state.data.smtp.port}
							onChange={e => {this.handleSmtpTextFieldChange(e, "port")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Username"
							errorText={this.state.errorText.smtp.userName}
							value={this.state.data.smtp.userName}
							onChange={e => {this.handleSmtpTextFieldChange(e, "userName")}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							type="password"
							hintText="Password"
							errorText={this.state.errorText.smtp.password}
							value={this.state.data.smtp.password}
							onChange={e => {this.handleSmtpTextFieldChange(e, "password")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<Toggle
							className="no-full-width"
							label="Use secure connection (TLS/SSL)"
							defaultToggled={this.state.data.smtp.tls}
							onToggle={e => {this.handleEnableToggle(e, "smtp")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child no-margin-after-me">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<h1 className="headline-smaller">Inbox server</h1>
						<p>
							Enter the account's inbox (IMAP) server configuration here. You can get this information from your email provider.
						</p>
					</div>
				</div>
				<div className="row no-margin-after-child no-margin-after-me">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Hostname"
							errorText={this.state.errorText.imap.host}
							value={this.state.data.imap.host}
							onChange={e => {this.handleImapTextFieldChange(e, "host")}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							type="number"
							hintText="Port number"
							errorText={this.state.errorText.imap.port}
							value={this.state.data.imap.port}
							onChange={e => {this.handleImapTextFieldChange(e, "port")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							hintText="Username"
							errorText={this.state.errorText.imap.userName}
							value={this.state.data.imap.userName}
							onChange={e => {this.handleImapTextFieldChange(e, "userName")}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<TextField
							className="full-width-text-field"
							type="password"
							hintText="Password"
							errorText={this.state.errorText.imap.password}
							value={this.state.data.imap.password}
							onChange={e => {this.handleImapTextFieldChange(e, "password")}}
						/>
					</div>
				</div>
				<div className="row no-margin-after-child">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<Toggle
							className="no-full-width"
							label="Use secure connection (TLS/SSL)"
							defaultToggled={this.state.data.imap.tls}
							onToggle={e => {this.handleEnableToggle(e, "imap")}}
						/>
					</div>
				</div>
				<SmallCenteredCircularProgress show={this.state.showProgress} />
				<ErrorDialog
					open={this.state.showErrorDialog}
					handleClose={this.handleErrorDialogClose}
					message="Saving the account failed"
					errorMessage={this.state.errorDialogErrorMessage}
				/>
			</Dialog>
		);
	}
});