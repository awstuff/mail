"use strict";

const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let accountId = +req.body.account;
	let signature = req.body.signature;

	if (!signature) {
		signature = null;
	}

	if (isNaN(accountId) || accountId < 1) {
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
					success : false,
					errorMessage : "Account not found"
				});
				return;
			}

			account.signature = signature;

			account.update(success => {
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
};
