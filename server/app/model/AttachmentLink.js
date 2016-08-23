"use strict";

const moment = require("moment");
const CryptoJS = require("crypto-js");
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");
const toBoolean = require("./../util/general/toBoolean");
const config = require("./../../config");

module.exports = class AttachmentLink {
	constructor () {
		this.id
			= this.mailbox
			= this.expires
			= this.partID
			= null;

		this.user
			= this.account
			= this.message
			= 0;
	}

	generateId () {
		this.id = CryptoJS.SHA256(Date.now().toString() + this.partID + this.user + this.account + this.message).toString();
	}

	generateExpiryDate () {
		let currentDate = new Date();

		this.expires = new Date(currentDate);
		this.expires.setHours(this.expires.getHours() + config.noHoursAttachmentLinkIsValid);
	}

	isExpired () {
		let expiryDateString = moment(this.expires).format(config.mysqlDateTimeStringFormat);	// is already in utc!

		let currentDateString = moment.utc().format(config.mysqlDateTimeStringFormat);	// convert to utc first

		return moment(expiryDateString).isBefore(currentDateString);
	}

	persist (callback) {
		let utcDateString = moment.utc(this.expires).format(config.mysqlDateTimeStringFormat);

		global.db.query("insert into attachmentlinks (id, user, account, mailbox, message, partID, expires) values (?, ?, ?, ?, ?, ?, ?)", [this.id, this.user, this.account, this.mailbox, this.message, this.partID, utcDateString], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	update (callback) {
		let utcDateString = moment.utc(this.expires).format(config.mysqlDateTimeStringFormat);

		global.db.query("update attachmentlinks set user = ?, account = ?, mailbox = ?, message = ?, partID = ?, expires = ? where id = ?", [this.user, this.account, this.mailbox, this.message, this.partID, utcDateString, this.id], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static getById (id, callback) {
		global.db.query("select * from attachmentlinks where id = ?", [id], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}
			
			let al = new AttachmentLink();
			Object.assign(al, res[0]);

			call(callback, err, al);
		});
	}

	static deleteExpiredLinks (callback) {
		let utcDateString = moment.utc(new Date()).format(config.mysqlDateTimeStringFormat);

		global.db.query("delete from attachmentlinks where expires < ?", [utcDateString], (err, res) => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}
};