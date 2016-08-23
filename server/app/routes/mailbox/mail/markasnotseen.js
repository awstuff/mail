"use strict";

const Token = require("./../../../model/Token");
const Account = require("./../../../model/Account");
const validate = require("./../../../util/general/validate");
const connectImap = require("./../../../util/mail/connectImap");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let accountId = +req.body.account;
	let mailbox = req.body.mailbox;
	let uid = +req.body.uid;

	if (isNaN(accountId) || accountId < 1 || !validate.stringNotEmpty(mailbox) || isNaN(uid)) {
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

		Account.getById(accountId, (err, account) => {
			if (err || !validate.objectNotEmpty(account) || account.user !== user.id) {
				res.json({
					success: false,
					errorMessage: "Account not found"
				});
				return;
			}

			connectImap(req, account.imap, (errorMessage, success, connection) => {
				if (errorMessage || success !== true || !validate.objectNotEmpty(connection)) {
					res.json({
						success: false,
						errorMessage: "Could not connect to mail server"
					});
					return;
				}

				connection.openBox(mailbox, false, (err, box) => {
					if (err || !validate.objectNotEmpty(box)) {
						res.json({
							success: false,
							errorMessage: "Could not open mailbox"
						});
						return;
					}

					connection.delFlags(uid, "Seen", err => {
						connection.closeBox(() => {
							connection.end();
						});

						if (err) {
							res.json({
								success: false
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
