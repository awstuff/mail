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
					success: false,
					errorMessage: "Account not found"
				});
				return;
			}

			account.getMailBoxes(req, boxes => {
				res.json(boxes);
			});
		});
	});
};
