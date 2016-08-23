"use strict";

const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const connectSmtp = require("./../../util/mail/connectSmtp");
const connectImap = require("./../../util/mail/connectImap");
const validate = require("./../../util/general/validate");
const toBoolean = require("./../../util/general/toBoolean");
const crypt = require("./../../util/auth/crypt");

module.exports = function (req, res) {
	if (!req.body || !req.body.smtp || !req.body.imap) {
		res.json({
			success: false
		});
		return;
	}

	let smtp = {
		port: +req.body.smtp.port,
		host: req.body.smtp.host,
		userName: req.body.smtp.userName,
		password: crypt.encrypt(req, req.body.smtp.password),
		tls: toBoolean(req.body.smtp.tls)
	};
	let imap = {
		port: +req.body.imap.port,
		host: req.body.imap.host,
		userName: req.body.imap.userName,
		password: crypt.encrypt(req, req.body.imap.password),
		tls: toBoolean(req.body.imap.tls)
	};
	let eMail = req.body.eMail;
	let fromName = req.body.fromName;

	// clean up
	req.body.smtp.password = req.body.imap.password = null;
	req.body.smtp = req.body.imap = null;

	if (!validate.stringNotEmpty([
		smtp.host,
		smtp.userName,
		smtp.password,
		imap.host,
		imap.userName,
		imap.password,
		fromName
	]) || !validate.stringRequiredAndMaxLength255(eMail)) {
		res.json({
			success: false
		});
		return;
	}

	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		connectSmtp(req, Object.assign(smtp, {
			fromName,
			eMail
		}), (errorMessage, success) => {
			if (errorMessage || success !== true) {
				res.json({
					success: false,
					errorMessage: errorMessage ? errorMessage : ""
				});
				return;
			}

			connectImap(req, imap, (errorMessage, success, connection) => {
				if (errorMessage || success !== true) {
					res.json({
						success: false,
						errorMessage: errorMessage ? errorMessage : ""
					});
					return;
				}

				connection.end();

				Account.userAlreadyHasThisAccount(user.id, eMail, {
					host: smtp.host,
					userName: smtp.userName
				}, {
					host: imap.host,
					userName: imap.userName
				}, has => {
					if (has) {
						res.json({
							success: false,
							errorMessage: "Account already exists"
						});
						return;
					}

					let account = new Account();

					account.fromName = fromName;
					account.smtp.host = smtp.host;
					account.smtp.password = smtp.password;
					account.smtp.userName = smtp.userName;
					account.smtp.port = smtp.port;
					account.smtp.tls = smtp.tls;
					account.imap.host = imap.host;
					account.imap.password = imap.password;
					account.imap.userName = imap.userName;
					account.imap.port = imap.port;
					account.imap.tls = imap.tls;
					account.user = user.id;
					account.eMail = eMail;

					account.persist(success => {
						if (success !== true) {
							res.json({
								success: false,
								errorMessage: "Database error"
							});
							return;
						}

						res.json({
							success: true
						});
					});
				});
			});
		});
	});
};
