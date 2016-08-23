"use strict";

const User = require("./../../model/User");
const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	let oldPassword = req.body.oldPassword;
	let newPassword = req.body.newPassword;

	if (typeof oldPassword === "string" || oldPassword instanceof String) {
		oldPassword = oldPassword.trim();
	}
	if (typeof newPassword === "string" || newPassword instanceof String) {
		newPassword = newPassword.trim();
	}

	if (!validate.stringNotEmpty([
			oldPassword,
			newPassword
		])) {
		res.json({
			success: false,
			errorMessage: "Illegal input value"
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

		user.verifyPassword(oldPassword, valid => {
			if (valid !== true) {
				res.json({
					success: false,
					errorMessage: "Invalid password"
				});
				return;
			}

			user.hashAndSetPassword(newPassword, err => {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Could not hash new password"
					});
					return;
				}

				user.update(success => {
					if (success !== true) {
						res.json({
							success: false,
							errorMessage: "Database error"
						});
						return;
					}

					console.log('changed password of user  "' + user.eMail + '" successfully.');
					res.json({
						success: true
					});
				})
			});
		});
	});
};
