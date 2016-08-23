"use strict";

const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let globalSignature = req.body.globalSignature;

	if (!globalSignature) {
		globalSignature = null;
	}

	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		user.globalSignature = globalSignature;

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
	});
};
