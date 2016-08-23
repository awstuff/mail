"use strict";

const Token = require("./../../model/Token");
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

		res.json({
			replyHeader: user.replyHeader
		});
	});
};
