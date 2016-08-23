"use strict";

const _ = require("lodash");
const moment = require("moment");
const striptags = require("striptags");
const Token = require("./../../model/Token");
const Account = require("./../../model/Account");
const RecipientCache = require("./../../model/RecipientCache");
const connectSmtp = require("./../../util/mail/connectSmtp");
const connectImap = require("./../../util/mail/connectImap");
const validate = require("./../../util/general/validate");
const generateFromField = require("./../../util/mail/generateFromField");
const toBoolean = require("./../../util/general/toBoolean");
const config = require("./../../../config");

module.exports = function (req, res) {
	if (!req.body || !req.body.message) {
		res.json({
			success: false
		});
		return;
	}

	let accountId = +req.body.account;
	let message = {
		to: req.body.message.to,
		cc: req.body.message.cc,
		bcc: req.body.message.bcc,
		subject: req.body.message.subject,
		priority: req.body.message.priority,
		isPlainText: toBoolean(req.body.message.isPlainText),
		text: req.body.message.text,
		attachments: req.body.message.attachments
	};

	if (typeof message.priority === "string" || message.priority instanceof String) {
		message.priority = message.priority.trim().toLowerCase();
	}

	if (message.priority !== "high" && message.priority !== "low") {
		message.priority = "normal";
	}

	if (isNaN(accountId) || accountId < 1 || !_.isArray(message.to) || !_.isArray(message.cc) || !_.isArray(message.bcc)) {
		res.json({
			success: false
		});
		return;
	}

	if (!_.some([	// there needs to be at least one valid recipient
		message.to,
		message.cc,
		message.bcc
	], e => {
		return e.length > 0 && _.every(e, r => {
			return validate.isValidEmail(r);
		});
	})) {
		res.json({
			success: false,
			errorMessage: "No valid recipient specified"
		});
		return;
	}

	message.attachments = message.attachments.map(a => {	// all attachments are in base64 format
		a.encoding = "base64";
		return a;
	});

	Token.getRequestUser(req, user => {
		if (!validate.objectNotEmpty(user)) {
			res.json({
				success: false,
				errorMessage: "User not found"
			});
			return;
		}

		Account.getById(accountId, (err, account) => {
			if (err || !validate.objectNotEmpty(account) || account.user !== user.id) {
				res.json({
					success : false,
					errorMessage : "Account not found"
				});
				return;
			}

			connectSmtp(req, account.smtp, (errorMessage, success, transporter) => {
				if (errorMessage || success !== true || !validate.objectNotEmpty(transporter)) {
					res.json({
						success : false,
						errorMessage : errorMessage ? errorMessage : ""
					});
					return;
				}

				let generalMailOptions = {
					to : message.to,
					cc : message.cc,
					bcc : message.bcc,
					from : generateFromField(account.fromName, account.eMail),
					subject : message.subject,
					priority : message.priority,
					attachments : message.attachments
				};

				let specificMailOptions = {};

				if (message.isPlainText) {
					specificMailOptions.text = message.text;
					specificMailOptions.html = void 0;
				} else {
					specificMailOptions.text = striptags(message.text.replace("<br>", "\r\n").replace("</p>", "\r\n"));	// fallback for email clients that don't support html eMails
					specificMailOptions.html = message.text;
				}

				if (user.recipientCacheEnabled) {
					RecipientCache.addMultipleToCache(user.id, message.to.concat(message.cc, message.bcc));
				}

				let mimeString = "";	// mime encoded string of the messages, obtained via evil nodemailer hack

				transporter.sendMail(Object.assign(generalMailOptions, specificMailOptions), (err, info) => {
					let mimeStringEnding = "\r\n.\r\n";

					if (mimeString.endsWith(mimeStringEnding)) {	// chop \r\n.\r\n off
						mimeString = mimeString.slice(0, -mimeStringEnding.length);
					}

					if (err) {
						res.json({
							success : false,
							errorMessage : err.message
						});
					}

					account.lastSent = moment.utc().format(config.mysqlDateTimeStringFormat);
					account.update();

					res.json({
						success : true,
						rejected : info.rejected
					});

					account.getMailBoxes(req, boxes => {
						if (!boxes || !boxes.length || boxes.success === false) {
							res.json({
								success : false,
								errorMessage : "No mailboxes found"
							});
							return;
						}

						let sentBox = _.find(boxes, box => {	// try to find an "official sent"
							return box.isSentFolder;
						});

						if (!sentBox) {
							sentBox = _.find(boxes, box => {	// try to find a box that is at least named "sent"
								return box.name.toLocaleLowerCase().trim() === "sent";
							});
						}

						if (!validate.objectNotEmpty(sentBox)) {	// "sent" box could not bee found, abort
							console.log("error: sent box could not be found after sending mail");
							return;
						}

						connectImap(req, account.imap, (errorMessage, success, connection) => {
							if (errorMessage || success !== true || !validate.objectNotEmpty(connection)) {
								console.log("error opening imap connection after sending mail: ", errorMessage);
								return;
							}

							connection.append(mimeString, {	// copy mail to "sent" box
								mailbox : sentBox.name,
								flags : "Seen"	// should be marked as seen
							}, err => {
								if (err) {
									console.log("error copying sent mail into sent folder: ", err);
								}

								connection.end();
							});
						});
					});
				}, chunk => {
					if (typeof chunk === "string" || chunk instanceof String) {
						mimeString += chunk;
					}
				});
			});
		});
	});
};