"use strict";

const async = require("async");
const MailParser = require("mailparser").MailParser;
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");
const toBoolean = require("./../util/general/toBoolean");
const connectImap = require("./../util/mail/connectImap");
const processMailboxList = require("./../util/mail/processMailboxList");
const config = require("./../../config");

module.exports = class Account {
	constructor () {
		this.smtp = {};
		this.imap = {};

		this.id
			= this.user
			= this.smtp.port
			= this.imap.port
			= 0;

		this.eMail
			= this.smtp.host
			= this.imap.host
			= this.smtp.userName
			= this.imap.userName
			= this.smtp.password
			= this.imap.password
			= this.fromName
			= this.signature
			= this.lastSent
			= this.lastRetrieved
			= null;

		this.smtp.tls
			= this.imap.tls
			= false;
	}

	getMailBoxes (req, callback) {
		connectImap(req, this.imap, (errorMessage, success, connection) => {
			if (errorMessage || success !== true || !validate.objectNotEmpty(connection)) {
				call(callback, {
					success: false
				});
				return;
			}

			connection.getBoxes((err, boxes) => {
				if (err || !boxes) {
					call(callback, {
						success: false,
						errorMessage: "Could not connect to mail server"
					});
					return;
				}

				boxes = processMailboxList(boxes);

				async.map(boxes, (box, innerCallback) => {

					connection.status(box.name, (err, boxStatus) => {
						if (err || !validate.objectNotEmpty(boxStatus) || !boxStatus.messages) {
							innerCallback("empty box status", null);
							return;
						}

						box.totalCount = boxStatus.messages.total;
						box.unseenCount = boxStatus.messages.unseen;

						innerCallback(null, box);
					});

				}, (err, results) => {
					if (err) {
						call(callback, {
							success: false
						});
						return;
					}

					connection.end();

					call(callback, results);
				});
			});
		});
	}

	getMailBoxContents (req, name, page, searchCriteria, callback) {
		connectImap(req, this.imap, (errorMessage, success, connection) => {
			if (errorMessage || success !== true || !validate.objectNotEmpty(connection)) {
				call(callback, {
					success: false,
					errorMessage: "Could not connect to mail server"
				});
				return;
			}

			connection.openBox(name, true, (err, box) => {
				if (err || !validate.objectNotEmpty(box)) {
					call(callback, {
						success: false,
						errorMessage: "Could not open mailbox"
					});
					return;
				}

				let noMessagesInBox = box.messages.total;

				//let sequence = ((page - 1) * config.paginationPageLength + 1) + ":" + Math.min(noMessagesInBox, config.paginationPageLength);
				//let sequence = "*:20";

				let messages = [];

				let sequence = "1:*";

				let errorOccurred = false;

				let f = connection.seq.fetch(sequence, {	// fetch emails
					bodies: "HEADER.FIELDS (DATE)"
				});


				f.once("error", err => {
					console.log(err);
					errorOccurred = true;
					call(callback, {
						success: false
					});
				});


				let connectionEnded = false;	// the connection has ended
				let parsingEnded = false;		// the parsing has finished

				let callCallbackIfEverythingIsFinished = () => {	// every email has been parsed and the connection has been closed
					if (connectionEnded && parsingEnded) {
						console.log(messages.length);



						call(callback, {
							messages: messages.reverse()
						});
					}
				};

				f.once("end", () => {
					connection.closeBox(() => {
						connection.end();
					});

					if (errorOccurred) {
						return;
					}

					connectionEnded = true;
					callCallbackIfEverythingIsFinished();
				});

				let parseCounter = 0;	// number of mails parsed. Needed to determine when the parsing has finished

				f.on("message", (msg) => {
					let currentMessage = {};

					let attributesAreSet = false;
					let contentIsSet = false;

					let pushCurrentMessageIfComplete = () => {	// attributes and content have been parsed, so the message can be pushed to the array
						if (attributesAreSet && contentIsSet) {
							messages.push(currentMessage);

							if (parseCounter++ === noMessagesInBox - 1) {
								parsingEnded = true;
								callCallbackIfEverythingIsFinished();
							}
						}
					};

					msg.on("attributes", attributes => {
						currentMessage.uid = attributes.uid;
						attributesAreSet = true;
						pushCurrentMessageIfComplete();
					});

					msg.on("body", stream => {
						let buffer = "";

						stream.on("data", chunk => {
							buffer += chunk.toString("utf8");
						});

						stream.once("end", () => {
								currentMessage.body = buffer;

								contentIsSet = true;
								pushCurrentMessageIfComplete();
						});
					});
				});

				//let noMessagesInBox = box.messages.total;
				//
				////let sequence = ((page - 1) * config.paginationPageLength + 1) + ":" + Math.min(noMessagesInBox, config.paginationPageLength);
				////let sequence = "*:20";
				//
				//let messages = [];
				//connection.seq.search(searchCriteria, (err, sequenceNos) => {
				//	if (err || !sequenceNos) {
				//		call(callback, {
				//			success: false,
				//			errorMessage: "Could not get mailbox contents from server"
				//		});
				//		return;
				//	}
				//
				//	if (sequenceNos.length < 1) {
				//		call(callback, []);
				//		return;
				//	}
				//
				//	let end = sequenceNos[sequenceNos.length - 1] - config.paginationPageLength * (page - 1);
				//	let start = end - config.paginationPageLength + 1;
				//
				//	if (start < 1) {
				//		start = 1;
				//	}
				//
				//	let sequence = start + ":" + end;
				//
				//	let sequenceLength = end - start + 1;
				//	let isFirstPage = end == noMessagesInBox;	// TODO bei anderer sortierung stimmt das halt (wahrscheinlich) nicht mehr!!
				//	let isLastPage = start == 1;
				//
				//	if (sequenceLength < 1) {
				//		call(callback, {
				//			success: false
				//		});
				//		return;
				//	}
				//
				//	let errorOccurred = false;
				//
				//	let f = connection.seq.fetch(sequence, {	// fetch emails
				//		bodies: "HEADER"
				//	});
				//
				//
				//	f.once("error", err => {
				//		console.log(err);
				//		errorOccurred = true;
				//		call(callback, {
				//			success: false
				//		});
				//	});
				//
				//
				//	let connectionEnded = false;	// the connection has ended
				//	let parsingEnded = false;		// the parsing has finished
				//
				//	let callCallbackIfEverythingIsFinished = () => {	// every email has been parsed and the connection has been closed
				//		if (connectionEnded && parsingEnded) {
				//			call(callback, {
				//				messages: messages.reverse(),
				//				isFirstPage,
				//				isLastPage
				//			});
				//		}
				//	};
				//
				//	f.once("end", () => {
				//		connection.closeBox(() => {
				//			connection.end();
				//		});
				//
				//		if (errorOccurred) {
				//			return;
				//		}
				//
				//		connectionEnded = true;
				//		callCallbackIfEverythingIsFinished();
				//	});
				//
				//	let parseCounter = 0;	// number of mails parsed. Needed to determine when the parsing has finished
				//
				//	f.on("message", (msg) => {
				//		let currentMessage = {};
				//
				//		let attributesAreSet = false;
				//		let contentIsSet = false;
				//
				//		let pushCurrentMessageIfComplete = () => {	// attributes and content have been parsed, so the message can be pushed to the array
				//			if (attributesAreSet && contentIsSet) {
				//				messages.push(currentMessage);
				//
				//				if (parseCounter++ === sequenceLength - 1) {
				//					parsingEnded = true;
				//					callCallbackIfEverythingIsFinished();
				//				}
				//			}
				//		};
				//
				//		msg.on("attributes", attributes => {
				//			currentMessage.uid = attributes.uid;
				//			currentMessage.seen = attributes.flags.indexOf("\\Seen") > -1;
				//			attributesAreSet = true;
				//			pushCurrentMessageIfComplete();
				//		});
				//
				//		msg.on("body", stream => {
				//			let buffer = "";
				//
				//			stream.on("data", chunk => {
				//				buffer += chunk.toString("utf8");
				//			});
				//
				//			stream.once("end", () => {
				//
				//				let mailParser = new MailParser();
				//
				//				mailParser.write(buffer);
				//				mailParser.end();
				//
				//				mailParser.on("end", (mail) => {
				//					Object.assign(currentMessage, {
				//						//messageId: mail.messageId,
				//						from: mail.from[0],
				//						to: mail.to,
				//						date: mail.date,	// is already in utc
				//						subject: mail.subject,
				//						priority: mail.priority
				//					});
				//
				//					contentIsSet = true;
				//					pushCurrentMessageIfComplete();
				//				});
				//			});
				//		});
				//	});
				//});
			});
		});
	}

	persist (callback) {
		global.db.query("insert into accounts (user, eMail, smtpHost, imapHost, smtpPort, imapPort, smtpUserName, imapUserName, smtpPassword, imapPassword, smtpTls, imapTls, fromName, signature, lastSent, lastRetrieved) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [this.user, this.eMail, this.smtp.host, this.imap.host, this.smtp.port, this.imap.port, this.smtp.userName, this.imap.userName, this.smtp.password, this.imap.password, this.smtp.tls, this.imap.tls, this.fromName, this.signature, this.lastSent, this.lastRetrieved], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	remove (callback) {
		global.db.query("delete from accounts where id = ?", [this.id], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	update (callback) {
		global.db.query("update accounts set user = ?, eMail = ?, smtpHost = ?, imapHost = ?, smtpPort = ?, imapPort = ?, smtpUserName = ?, imapUserName = ?, smtpPassword = ?, imapPassword = ?, smtpTls = ?, imapTls = ?, fromName = ?, signature = ?, lastSent = ?, lastRetrieved = ? where id = ?", [this.user, this.eMail, this.smtp.host, this.imap.host, this.smtp.port, this.imap.port, this.smtp.userName, this.imap.userName, this.smtp.password, this.imap.password, this.smtp.tls, this.imap.tls, this.fromName, this.signature, this.lastSent, this.lastRetrieved, this.id], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static dbEntryToAccount (d) {
		let account = new Account();

		account.id = +d.id;
		account.user = +d.user;
		account.eMail = d.eMail;
		account.fromName = d.fromName;
		account.signature = d.signature;
		account.lastRetrieved = d.lastRetrieved;
		account.lastSent = d.lastSent;
		account.smtp.host = d.smtpHost;
		account.smtp.port = +d.smtpPort;
		account.smtp.userName = d.smtpUserName;
		account.smtp.password = d.smtpPassword;
		account.smtp.tls = toBoolean(d.smtpTls);
		account.imap.host = d.imapHost;
		account.imap.port = +d.imapPort;
		account.imap.userName = d.imapUserName;
		account.imap.password = d.imapPassword;
		account.imap.tls = toBoolean(d.imapTls);

		return account;
	}

	static getById (id, callback) {
		global.db.query("select * from accounts where id = ?", [id], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let account = Account.dbEntryToAccount(res[0]);

			call(callback, err, account);
		});
	}

	static getByUser (user, callback) {
		global.db.query("select a.*, (a.id = u.defaultAccount) as isDefaultAccount from accounts a, users u where u.id = 1 and a.user = u.id order by isDefaultAccount desc, a.fromName asc, a.eMail asc", [user], (err, res) => {
			if (err) {
				call(callback, err, []);
				return;
			}

			res = res.map(a => {
				return Account.dbEntryToAccount(a);
			});

			call(callback, err, res);
		});
	}

	//static getByUser (user, callback) {
	//	global.db.query("select a.*, (a.id = u.defaultAccount) as isDefaultAccount from accounts a, users u where u.id = ? and a.user = u.id order by isDefaultAccount desc, a.fromName asc, a.eMail asc", [user], (err, res) => {
	//		if (err) {
	//			call(callback, err, []);
	//			return;
	//		}
	//
	//		res = res.map(a => {
	//			let account = Account.dbEntryToAccount(a);
	//			//account.smtp.password = account.imap.password = "XXXXXXXX";
	//			account.smtp.password = account.imap.password = "";
	//
	//			delete account.user;
	//			return account;
	//		});
	//
	//		call(callback, err, res);
	//	});
	//}

	static getByUserCensoredNotSortedByDefault (user, callback) {
		global.db.query("select a.* from accounts a, users u where u.id = ? and a.user = u.id order by a.fromName asc, a.eMail asc", [user], (err, res) => {
			if (err) {
				call(callback, err, []);
				return;
			}

			res = res.map(a => {
				let account = Account.dbEntryToAccount(a);
				account.smtp.password = account.imap.password = "";
				delete account.user;
				return account;
			});

			call(callback, err, res);
		});
	}

	static userAlreadyHasThisAccount (user, eMail, smtp, imap, callback) {
		global.db.query("select id from accounts where user = ? and (eMail = ? or (smtpHost = ? and smtpUserName = ?) or (imapHost = ? and imapUserName = ?))", [user, eMail, smtp.host, smtp.userName, imap.host, imap.userName], (err, res) => {
			if (err || res.length !== 0) {
				call(callback, true);
				return;
			}

			call(callback, false);
		});
	}
};