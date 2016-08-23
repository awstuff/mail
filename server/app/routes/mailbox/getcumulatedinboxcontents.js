"use strict";

const _ = require("lodash");
const async = require("async");
const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
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

		Account.getByUser(user.id, (err, accounts) => {
			if (err || !_.isArray(accounts)) {
				res.json({
					success: false,
					errorMessage: "Account not found"
				});
				return;
			}

			let contents = [];

			async.each(accounts, (account, innerCallback) => {
				if (!validate.objectNotEmpty(account)) {
					innerCallback("Empty account found");
					return;
				}

				account.getMailBoxes(req, boxes => {
					if (!boxes || !boxes.length || boxes.success === false) {
						innerCallback();
						return;
					}

					boxes = boxes.filter((box, index) => {
						return box.isInboxFolder || box.name.toLocaleLowerCase().trim() === "inbox" || index === 0;
					});

					console.log(boxes);

					// TODO CONTINUE HERE

					innerCallback();
				});
			}, err => {
				if (err) {
					res.json({
						success: false
					});
					return;
				}

				res.json(contents);
			});
		});
	});
};