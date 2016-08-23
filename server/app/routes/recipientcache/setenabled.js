"use strict";

const Token = require("./../../model/Token");
const RecipientCache = require("./../../model/RecipientCache");
const validate = require("./../../util/general/validate");
const toBoolean = require("./../../util/general/toBoolean");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let enabled = toBoolean(req.body.enabled);

	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		user.recipientCacheEnabled = enabled;

		let updateUser = () => {
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
		};

		if (!enabled) {	// if recipientcache is disabled now, clear the whole thing
			RecipientCache.clearByUser(user.id, success => {
				if (success !== true) {
					res.json({
						success: false,
						errorMessage: "Database error"
					});
					return;
				}

				updateUser();
			});
		} else {
			updateUser();
		}
	});
};
