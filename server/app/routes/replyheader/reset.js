"use strict";

const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");
const config = require("./../../../config");

module.exports = function (req, res) {
	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		user.replyHeader = config.defaultReplyHeader;

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
