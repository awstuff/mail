"use strict";

const _ = require("lodash");
const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const validate = require("./../../util/general/validate");

module.exports = function (req, res) {
	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false
			});
			return;
		}

		Account.getByUserCensoredNotSortedByDefault(user.id, (err, accounts) => {
			if (err || !_.isArray(accounts)) {
				res.json({
					success: false
				});
				return;
			}

			res.json(accounts);
		});
	});
};
