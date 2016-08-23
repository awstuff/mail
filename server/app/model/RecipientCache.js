"use strict";

const async = require("async");
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");

module.exports = class RecipientCache {
	constructor () {
		this.id
			= this.user
			= 0;

		this.eMail = null;
	}

	persist (callback) {
		global.db.query("insert into recipientcache (user, eMail) values (?, ?)", [this.user, this.eMail], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	update (callback) {
		global.db.query("update recipientcache set user = ?, eMail = ? where id = ?", [this.user, this.eMail, this.id], err => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static getById (id, callback) {
		global.db.query("select * from recipientcache where id = ?", [id], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let rc = new RecipientCache();
			Object.assign(rc, res[0]);

			call(callback, err, rc);
		});
	}

	static addSingleToCache (user, eMail, callback) {
		this.eMailAlreadyCached(user, eMail, cached => {
			if (cached) {
				call(callback, true);
				return;
			}

			let rc = new RecipientCache();

			rc.user = user;
			rc.eMail = eMail;

			rc.persist(callback);
		});
	}

	static addMultipleToCache (user, eMails, callback) {
		async.each(eMails, (eMail, innerCallback) => {	// due to parallel execution, duplicates can still occur
			this.addSingleToCache(user, eMail, success => {
				if (success !== true) {
					innerCallback("single eMail could not be added to cache");
					return;
				}

				innerCallback();
			})
		}, err => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static clearByUser (user, callback) {
		global.db.query("delete from recipientcache where user = ?", [user], err => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static eMailAlreadyCached (user, eMail, callback) {
		global.db.query("select id from recipientcache where user = ? and eMail = ?", [user, eMail], (err, res) => {
			if (err || res.length !== 0) {
				call(callback, true);
				return;
			}

			call(callback, false);
		});
	}

	static getCache (user, callback) {
		global.db.query("select distinct eMail from recipientcache where user = ? order by eMail asc", [user], (err, res) => {
			if (err) {
				call(callback, []);
				return;
			}

			call(callback, res.map(e => {
				return e.eMail;
			}));
		});
	}
};