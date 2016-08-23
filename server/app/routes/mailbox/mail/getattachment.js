"use strict";

const _ = require("lodash");
const async = require("async");
const atob = require("atob");
const isTextOrBinary = require("istextorbinary");
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

	let id = req.body.id;

	if (!validate.stringNotEmpty(id)) {
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

		AttachmentLink.getById(id, (err, attachmentLink) => {
			if (err || !validate.objectNotEmpty(attachmentLink) || attachmentLink.user !== user.id || attachmentLink.isExpired()) {
				res.json({
					success: false,
					errorMessage: "Attachment link not found"
				});
				return;
			}

			Account.getById(attachmentLink.account, (err, account) => {
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

					connection.openBox(attachmentLink.mailbox, false, (err, box) => {
						if (err || !validate.objectNotEmpty(box)) {
							res.json({
								success: false,
								errorMessage: "Could not open mailbox"
							});
							return;
						}

						let f = connection.fetch(attachmentLink.message, {	// fetch email
							bodies: attachmentLink.partID,
							struct: true
						});

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

						f.on("message", (msg) => {
							let body = null;
							let mime = null;
							let fileName = null;
							let encoding = null;
							let fileSize = 0;

							let attributesParsed = false;
							let bodyParsed = false;


							let everyThingHasBeenParsed = () => {
								if (attributesParsed && bodyParsed) {
									closeConnection();

									if (encoding.toLowerCase() === "base64") {	// decode attachment if it's base64 encoded
										body = atob(body);
									}

									isTextOrBinary.isText(fileName, body, (err, result) => {
										if (err) {
											res.json({
												success: false,
												errorMessage: "Could not determine file type"
											});
											return;
										}

										if (result === false) {	// binary file, so it needs to be transformed to byte codes
											let asBytes = new Array(body.length);

											for (let i = 0; i < body.length; i++) {
												asBytes[i] = body.charCodeAt(i);	// somehow does not work if using body directly
											}

											body = asBytes;
										}

										res.json({
											fileName,
											size: fileSize,
											mime,
											content: body,
											isBinary: result === false
										});
									});

									//res.append("Content-Disposition", "attachment" + (fileName ? '; filename="' + fileName + '"' : ""));
									//
									//if (fileSize > 0) {
									//	res.append("Content-Length", fileSize);
									//}
									//
									//res.append("Content-Type", mime);
								}
							};


							msg.on("attributes", attributes => {
								let structure = attributes.struct;	// the message structure
								let partFound = false;	// part has been found
								let part = null;

								let findPart = tree => {	// recursively find the desired part inside the message structure. Not saving this data inside the database in the first place saves memory and reduces the private user data we have to store
									if (partFound) {
										return;
									}

									_.forEach(tree, node => {
										if (partFound) {
											return;	// imitating break statement
										}

										if (_.isArray(node)) {
											findPart(node);
										} else {
											if (node.partID === attachmentLink.partID) {
												part = node;
												partFound = true;
											}
										}
									});
								};

								findPart(structure);

								if (!validate.objectNotEmpty(part)) {
									res.json({
										success: true,
										errorMessage: "Attachment not found in message structure"
									});
									closeConnection();
									return;
								}

								if (part.disposition.params && part.disposition.params.filename) {
									fileName = part.disposition.params.filename;
								} else {
									fileName = "file";
								}

								mime = part.type + (part.subtype ? "/" + part.subtype : "");

								encoding = part.encoding;

								fileSize = +part.size;

								attributesParsed = true;
								everyThingHasBeenParsed();
							});

							msg.on("body", stream => {
								let buffer = "";

								stream.on("data", chunk => {
									buffer += chunk.toString("utf8");
								});

								stream.once("end", () => {
									body = buffer;
									bodyParsed = true;
									everyThingHasBeenParsed();
								});
							});
						});
					});
				});
			});
		});
	});
};
