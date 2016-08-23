"use strict";

const mkdirp = require("mkdirp");
const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const validate = require("./../../util/general/validate");
const createExportFolder = require("./../../util/fs/createExportFolder");
const deleteExportFolderContents = require("./../../util/fs/deleteExportFolderContents");

module.exports = function (req, res) {
	//if (!req.body) {
	//	res.json({
	//		success: false
	//	});
	//	return;
	//}
	//
	//let accountId = +req.body.account;
	//let mailbox = req.body.mailbox;
	//
	//if (isNaN(accountId) || accountId < 1 || !validate.stringNotEmpty(mailbox)) {
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
	//		account.lastRetrieved = new Date();	// TODO utc
	//		account.update();
	//
	//		let exportId = user.id + "_" + Date.now();
	//
	//		mkdirp(global.temporaryExportFolder + "/" + exportId, err => {
	//			if (err) {
	//				res.json({
	//					success: false,
	//					errorMessage: "File system error"
	//				});
	//				return;
	//			}
	//
	//			//account.getMailBoxContents(req, mailbox, page, contents => {
	//			//	res.json(contents);
	//			//});
	//
	//
	//			deleteExportFolderContents(exportId);
	//		});
	//	});
	//});
};
