"use strict";

const moment = require("moment");
const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const validate = require("./../../util/general/validate");
const config = require("./../../../config");

module.exports = function (req, res) {
	//if (!req.body) {
		res.json({
			success: false
		});
		return;
	//}
	//
	//let accountId = +req.body.account;
	//let mailbox = req.body.mailbox;
	//let page = +req.body.page;
	//let query = req.body.query;
	//
	//if (isNaN(page) || page < 1 || page % 1 !== 0) {
	//	page = 1;
	//}
	//
	//if (isNaN(accountId) || accountId < 1 || !validate.stringNotEmpty(mailbox) || !validate.stringNotEmpty(query)) {
	//	res.json({
	//		success: false
	//	});
	//	return;
	//}
	//
	//Token.getRequestUser(req, user => {
	//	if (!validate.objectNotEmpty(user)) {
	//		res.json({
	//			success: false,
	//			errorMessage: "User not found"
	//		});
	//		return;
	//	}
	//
	//	Account.getById(accountId, (err, account) => {
	//		if (err || !validate.objectNotEmpty(account) || account.user !== user.id) {
	//			res.json({
	//				success: false,
	//				errorMessage: "Account not found"
	//			});
	//			return;
	//		}
	//
	//		account.lastRetrieved = moment.utc().format(config.mysqlDateTimeStringFormat);
	//		account.update();
	//
	//		account.getMailBoxContents(req, mailbox, page, [["HEADER", "TO", query]], contents => {
	//			res.json(contents);
	//		});
	//	});
	//});
};
