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

	let replyHeader = req.body.replyHeader;

	if (!validate.stringNotEmpty(replyHeader)) {
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

		user.replyHeader = replyHeader;

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
