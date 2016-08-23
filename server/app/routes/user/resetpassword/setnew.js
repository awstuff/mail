"use strict";

const User = require("./../../../model/User");
const UniqueLink = require("./../../../model/UniqueLink");
const validate = require("./../../../util/general/validate");
const deviceId = require("./../../../util/auth/deviceId");
const sendResetPasswordMail = require("./../../../util/auth/sendResetPasswordMail");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false,
			errorMessage: "Empty request body"
		});
		return;
	}

	let id = req.body.id;
	let eMail = req.body.eMail;
	let newPassword = req.body.newPassword;

	if (typeof id === "string" || id instanceof String) {
		id = id.trim();
	}
	if (typeof eMail === "string" || eMail instanceof String) {
		eMail = eMail.trim();
	}
	if (typeof newPassword === "string" || newPassword instanceof String) {
		newPassword = newPassword.trim();
	}

	if (!validate.stringNotEmpty([
		eMail,
		id
	]) || !validate.isValidEmail(eMail) || !validate.stringRequiredAndMaxLength255(newPassword)) {
		res.json({
			success: false,
			errorMessage: "Invalid input data"
		});
		return;
	}

	UniqueLink.getById(id, (err, uniqueLink) => {
		if (err || !validate.objectNotEmpty(uniqueLink) || uniqueLink.used !== false || uniqueLink.isExpired()) {
			res.json({
				success: false,
				errorMessage: "Reset link does not exist"
			});
			return;
		}

		User.eMailExists(eMail, (err, exists, user) => {
			if (err || exists !== true || !validate.objectNotEmpty(user) || uniqueLink.user !== user.id) {
				res.json({
					success: false,
					errorMessage: "Invalid user"
				});
				return;
			}

			user.hashAndSetPassword(newPassword, err => {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Could not set new password"
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

					console.log('reset password of user "' + eMail + '" successfully.');

					res.json({
						success: true
					});

					uniqueLink.used = true;
					uniqueLink.device = deviceId.get(req);

					uniqueLink.update(success => {
						if (success !== true) {
							console.log("could not mark unique link " + id + " as used.");
						}

						console.log("unique link " + id + " successfully marked as used.");
					});
				})
			});
		});
	});
};
