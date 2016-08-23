"use strict";

const User = require("./../../../model/User");
const UniqueLink = require("./../../../model/UniqueLink");
const validate = require("./../../../util/general/validate");
const sendResetPasswordMail = require("./../../../util/auth/sendResetPasswordMail");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false,
			errorMessage: "Empty request body"
		});
		return;
	}

	let eMail = req.body.eMail;

	if (typeof eMail === "string" || eMail instanceof String) {
		eMail = eMail.trim();
	}

	if (!validate.stringNotEmpty(eMail) || !validate.isValidEmail(eMail)) {
		res.json({
			success: false,
			errorMessage: "Invalid email adress"
		});
		return;
	}

	User.eMailExists(eMail, (err, exists, user) => {
		if (err || exists !== true || !validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User does not exist"
			});
			return;
		}

		let uniqueLink = new UniqueLink();
		uniqueLink.user = user.id;
		uniqueLink.generateId();	// set other properties first, since they are needed for id generation!
		uniqueLink.generateExpiryDate();

		uniqueLink.persist(success => {
			if (success !== true) {
				res.json({
					success: false,
					errorMessage: "Database error"
				});
				return;
			}

			sendResetPasswordMail(eMail, uniqueLink.id);

			res.json({
				success: true
			});
		});
	});
};
