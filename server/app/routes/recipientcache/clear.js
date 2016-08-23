"use strict";

const Token = require("./../../model/Token");
const RecipientCache = require("./../../model/RecipientCache");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		RecipientCache.clearByUser(user.id, success => {
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
