"use strict";

const _ = require("lodash");
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

			account.getMailBoxes(req, boxes => {
				if (!boxes || !boxes.length || boxes.success === false) {
					res.json({
						success: false,
						errorMessage: "No mailboxes found"
					});
					return;
				}

				let trashBox = _.find(boxes, box => {	// try to find an "official trash"
					return box.isTrashFolder;
				});

				if (!trashBox) {
					trashBox = _.find(boxes, box => {	// try to find a box that is at least named "trash"
						return box.name.toLocaleLowerCase().trim() === "trash";
					});
				}

				if (!validate.objectNotEmpty(trashBox)) {
					res.json({
						success: false,
						errorMessage: "No trash mailbox found"
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

						//connection.addFlags(uid, "Deleted", err => {
						connection.move(uid, trashBox.name, err => {
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
	});
};
