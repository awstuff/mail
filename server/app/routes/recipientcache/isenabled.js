"use strict";

const Token = require("./../../model/Token");
const RecipientCache = require("./../../model/RecipientCache");
const validate = require("./../../util/general/validate");
const toBoolean = require("./../../util/general/toBoolean");

module.exports = function (req, res) {
	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		res.json({
			isEnabled: user.recipientCacheEnabled
		});
	});
};
