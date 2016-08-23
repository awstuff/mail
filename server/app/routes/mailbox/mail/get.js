"use strict";

const _ = require("lodash");
const async = require("async");
const MailParser = require("mailparser").MailParser;
const Token = require("./../../../model/Token");
const Account = require("./../../../model/Account");
const AttachmentLink = require("./../../../model/AttachmentLink");
const validate = require("./../../../util/general/validate");
const connectImap = require("./../../../util/mail/connectImap");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let accountId = +req.body.account;
	let mailbox = req.body.mailbox;
	let uid = +req.body.uid;

	if (isNaN(accountId) || accountId < 1 || !validate.stringNotEmpty(mailbox) || isNaN(uid)) {
		res.json({
			success: false
		});
		return;
	}

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
					success: false,
					errorMessage: "Account not found"
				});
				return;
			}

			connectImap(req, account.imap, (errorMessage, success, connection) => {
				if (errorMessage || success !== true || !validate.objectNotEmpty(connection)) {
					res.json({
						success: false,
						errorMessage: "Could not connect to mail server"
					});
					return;
				}

				connection.openBox(mailbox, false, (err, box) => {
					if (err || !validate.objectNotEmpty(box)) {
						res.json({
							success: false,
							errorMessage: "Could not open mailbox"
						});
						return;
					}

					let f = connection.fetch(uid, {	// fetch email
						bodies: "HEADER",
						struct: true
					});

					let errorOccurred = false;

					let closeConnection = () => {
						connection.closeBox(() => {
							connection.end();
						});
					};

					f.once("error", err => {
						console.log(err);
						res.json({
							success: false,
							errorMessage: "Error while fetching message from server"
						});
						closeConnection();
					});

					let message = {};
					let attachments = [];

					f.on("message", (msg) => {
						let attributesParsed = false;
						let bodyParsed = false;
						let textPartId;	// partId of the text part, to be fetched later

						let callbackWhenEverythingHasBeenParsed = () => {
							if (!errorOccurred && attributesParsed && bodyParsed) {
								let fetchTextPart = connection.fetch(uid, {	// fetch email
									bodies: textPartId
								});

								fetchTextPart.once("error", err => {
									console.log(err);
									res.json({
										success: false,
										errorMessage: "Error while fetching text part from server"
									});
									closeConnection();
								});

								fetchTextPart.on("message", textMsg => {
									textMsg.on("body", stream => {
										let buffer = "";

										stream.on("data", chunk => {
											buffer += chunk.toString("utf8");	// TODO maybe change charset to resemble the one used in the message?
										});

										stream.once("end", () => {
											message.text = buffer;

											connection.addFlags(uid, "Seen", err => {
												closeConnection();

												if (err) {
													res.json({
														success: false,
														errorMessage: "Could not mark message as seen"
													});
													return;
												}

												res.json(message);
											});
										});
									});
								});
							}
						};

						msg.on("attributes", attributes => {
							if (!validate.objectNotEmpty(attributes) || !attributes.struct || !attributes.struct.length) {
								res.json({
									success: false,
									errorMessage: "Message structure empty"
								});
								closeConnection();
								return;
							}

							let structure = attributes.struct;

							let parseTextAlternatives = alternatives => {	// parse text part alternatives
								alternatives = alternatives.map(alternative => {	// every node is nested in a one-element array
									return alternative[0];
								});

								let htmlPart = _.find(alternatives, node => {
									return node.disposition == null && node.type === "text" && node.subtype === "html";
								});

								if (htmlPart) {	// there is a html part
									message.isPlainText = false;
									textPartId = htmlPart.partID;
									return;
								}

								let plainPart = _.find(alternatives, node => {
									return node.disposition == null && node.type === "text";
								});

								if (!plainPart) {
									res.json({
										success: false,
										errorMessage: "No text part found"
									});
									closeConnection();
									return;
								}

								message.isPlainText = true;
								textPartId = plainPart.partID;
							};


							let parseAttachments = struct => {	// parse attachments from structure
								_.forEach(struct, node => {
									if (_.isArray(node)) {	// call recursively
										parseAttachments(node);
										return;
									}

									if (validate.objectNotEmpty(node.disposition) && (node.disposition.type === "attachment" || node.disposition.type === "inline")) {
										let fileName;
										if (node.disposition.params && node.disposition.params.filename) {
											fileName = node.disposition.params.filename;
										} else {
											fileName = "file" + (attachments.length + 1);
										}

										attachments.push({
											partID: node.partID,
											fileName
										});
									}
								});
							};

							if (structure.length === 1 && structure[0].type === "text") {	// just one text part

								message.isPlainText = structure[0].subtype === "plain";
								textPartId = structure[0].partID;

							} else if (structure.length > 1 && structure[0].type === "alternative") {	// multple text parts

								parseTextAlternatives(structure.slice(1));

							} else if (structure.length > 1 && structure[0].type === "mixed") {	// multiple parts, mixes

								let remainderOfStructure = structure.slice(1);

								let htmlPart = _.find(remainderOfStructure, node => {
									return node.length && node[0] && node[0].disposition == null && node[0].type === "text" && node[0].subtype === "html";
								});

								if (htmlPart) {	// there is a html part
									message.isPlainText = false;
									textPartId = htmlPart[0].partID;
								} else {
									let plainPart = _.find(remainderOfStructure, node => {
										return node.length && node[0] && node[0].disposition == null && node[0].type === "text";
									});

									if (plainPart) {
										message.isPlainText = true;
										textPartId = plainPart[0].partID;
									} else {
										let alternativesPart = _.find(remainderOfStructure, part => {
											return part.length && part[0] && part[0].type === "alternative"
										});

										if (alternativesPart) {
											parseTextAlternatives(alternativesPart.slice(1));
										} else {
											res.json({
												success: false,
												errorMessage: "No alternatives part found"
											});
											closeConnection();
											return;
										}
									}
								}

								parseAttachments(remainderOfStructure);

							} else {

								res.json({
									success: false,
									errorMessage: "Corrupted message structure"
								});
								closeConnection();
								return;

							}


							let attachmentsProcessedSuccessfully = () => {	// callback for when attachments were processed successfully
								message.attachments = attachments;
								attributesParsed = true;
								callbackWhenEverythingHasBeenParsed();
							};


							if (attachments.length > 0) {
								async.map(attachments, (attachment, innerCallback) => {	// create database entries for attachment links

									let link = new AttachmentLink();
									link.user = user.id;
									link.account = account.id;
									link.mailbox = mailbox;
									link.message = uid;
									link.partID = attachment.partID;
									link.generateId();	// set other properties first, since they are needed for id generation!
									link.generateExpiryDate();

									link.persist(success => {
										if (success !== true) {
											innerCallback("could not persist attachment link", null);
											return;
										}

										innerCallback(null, {
											id: link.id,
											fileName: attachment.fileName
										});
									});

								}, (err, results) => {
									if (err) {
										res.json({
											success: false,
											errorMessage: "Database error while processing attachments"
										});
										closeConnection();
										return;
									}

									attachments = results;

									attachmentsProcessedSuccessfully();
								});
							} else {
								attachmentsProcessedSuccessfully();	// call immediately
							}
						});

						msg.on("body", stream => {
							let buffer = "";

							stream.on("data", chunk => {
								buffer += chunk.toString("utf8");
							});

							stream.once("end", () => {
								let mailParser = new MailParser();

								mailParser.write(buffer);
								mailParser.end();

								mailParser.on("end", (mail) => {
									Object.assign(message, {
										from: mail.from[0],
										to: mail.to,
										date: mail.date,	// is already in utc
										subject: mail.subject,
										priority: mail.priority
									});

									bodyParsed = true;
									callbackWhenEverythingHasBeenParsed();
								});
							});
						});
					});
				});
			});
		});
	});
};
