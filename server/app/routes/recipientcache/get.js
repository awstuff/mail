"use strict";

const Token = require("./../../model/Token");
const RecipientCache = require("./../../model/RecipientCache");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json([]);
			return;
		}

		RecipientCache.getCache(user.id, cache => {
			res.json(cache);
		});
	});
};
