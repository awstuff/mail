"use strict";

const moment = require("moment");
const CryptoJS = require("crypto-js");
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");
const toBoolean = require("./../util/general/toBoolean");
const config = require("./../../config");

module.exports = class UniqueLink {
	constructor () {
		this.id
			= this.device
			= this.expires
			= null;

		this.user = 0;

		this.used = false;
	}

	generateId () {
		this.id = CryptoJS.SHA256(Date.now().toString() + this.user).toString();
	}

	generateExpiryDate () {
		let currentDate = new Date();

		this.expires = new Date(currentDate);
		this.expires.setDate(this.expires.getDate() + config.auth.noDaysUniqueLinkIsValid);
	}

	isExpired () {
		let expiryDateString = moment(this.expires).format(config.mysqlDateTimeStringFormat);	// is already in utc!

		let currentDateString = moment.utc().format(config.mysqlDateTimeStringFormat);	// convert to utc first

		return moment(expiryDateString).isBefore(currentDateString);
	}

	persist (callback) {
		let utcDateString = moment.utc(this.expires).format(config.mysqlDateTimeStringFormat);

		global.db.query("insert into uniquelinks (id, user, used, device, expires) values (?, ?, ?, ?, ?)", [this.id, this.user, this.used, this.device, utcDateString], err => {
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

		global.db.query("update uniquelinks set user = ?, used = ?, device = ?, expires = ? where id = ?", [this.user, this.used, this.device, utcDateString, this.id], err => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static dbEntryToUniqueLink (d) {
		let link = new UniqueLink();

		link.id = d.id;
		link.user = d.user;
		link.used = toBoolean(d.used);
		link.device = d.device;
		link.expires = d.expires;

		return link;
	}

	static getById (id, callback) {
		global.db.query("select * from uniquelinks where id = ?", [id], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let ul = UniqueLink.dbEntryToUniqueLink(res[0]);

			call(callback, err, ul);
		});
	}
};