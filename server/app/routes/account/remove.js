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

	let id = +req.body.id;

	if (isNaN(id) || id < 1) {
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

		Account.getById(id, (err, account) => {
			if (err || !validate.objectNotEmpty(account) || account.user !== user.id) {
				res.json({
					success: false,
					errorMessage: "Account not found"
				});
				return;
			}

			account.remove(success => {
				if (success !== true) {
					res.json({
						success: false,
						errorMessage: "Database error"
					});
					return;
				}

				if (user.defaultAccount === id) {	// the default account needs to be reset

					user.defaultAccount = 0;

					user.update(success => {
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

				} else {

					res.json({
						success: true
					});

				}
			});
		});
	});
};
