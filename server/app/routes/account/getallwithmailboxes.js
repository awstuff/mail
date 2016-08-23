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
				success: false
			});
			return;
		}

		Account.getByUser(user.id, (err, accounts) => {
			if (err || !_.isArray(accounts)) {
				res.json({
					success: false
				});
				return;
			}

			async.map(accounts, (account, innerCallback) => {

				account.getMailBoxes(req, boxes => {
					delete account.lastRetrieved;
					delete account.lastSent;
					delete account.signature;
					delete account.user;
					delete account.smtp;
					delete account.imap;

					account.mailboxes = _.isArray(boxes) ? boxes : [];

					innerCallback(null, account);
				});

			}, (err, results) => {
				if (err) {
					res.json({
						success: false
					});
					return;
				}

				res.json(accounts);
			});
		});
	});
};
