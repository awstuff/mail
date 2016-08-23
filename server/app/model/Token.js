"use strict";

const jsonwebtoken = require("jsonwebtoken");
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");
const deviceId = require("./../util/auth/deviceId");
const config = require("./../../config");
const User = require("./User");

module.exports = class Token {
	constructor () {
		this.id
			= this.user
			= 0;

		this.device
			= this.token
			= 0;
	}

	generateAndSetToken (callback) {
		User.getById(this.user, (err, user) => {

			if (err || !validate.objectNotEmpty(user)) {
				this.token = null;
				call(callback, false);
				return;
			}

			this.token = jsonwebtoken.sign({
				id: this.user,
				eMail: user.eMail,
				timestamp: Date.now()
			}, config.auth.secret);

			call(callback, true);
		});
	}

	persist (callback) {
		global.db.query("insert into tokens (user, device, token) values (?, ?, ?)", [this.user, this.device, this.token], err => {
			if (err) {
				console.log(err);

				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	update (callback) {
		global.db.query("update tokens set user = ?, device = ?, token = ? where id = ?", [this.user, this.device, this.token, this.id], err => {
			if (err) {
				call(callback, false);
				return;
			}

			call(callback, true);
		});
	}

	static getUserByTokenAndDeviceAndVerify (token, device, callback) {

		Token.getIdAndEmailFromToken(token, res => {
			if (!res || !res.id || !res.eMail) {
				call(callback, null);
				return;
			}

			Token.getByTokenAndDevice(token, device, (err, t) => {
				if (err || !validate.objectNotEmpty(t) || t.user !== res.id) {
					call(callback, null);
					return;
				}

				User.getById(res.id, (err, user) => {
					if (err) {
						call(callback, null);
						return;
					}

					if (!validate.objectNotEmpty(user) || user.eMail !== res.eMail) {
						call(callback, null);
						return;
					}

					call(callback, user);
				});
			});
		});
	}

	static getIdAndEmailFromToken (token, callback) {
		jsonwebtoken.verify(token, config.auth.secret, (err, decoded) => {
			if (err || !validate.objectNotEmpty(decoded)) {
				call(callback, false);
				return;
			}

			call(callback, {
				id: decoded.id,
				eMail: decoded.eMail
			});
		});
	}


	static getById (id, callback) {
		global.db.query("select * from tokens where id = ?", [id], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let t = new Token();
			Object.assign(t, res[0]);

			call(callback, err, t);
		});
	}

	static getByTokenAndDevice (token, device, callback) {
		global.db.query("select * from tokens where token = ? and device = ?", [token, device], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let t = new Token();
			Object.assign(t, res[0]);

			call(callback, err, t);
		});
	}

	static getByUserAndDevice (user, device, callback) {
		global.db.query("select * from tokens where user = ? and device = ?", [user, device], (err, res) => {
			if (err || res.length !== 1) {
				call(callback, err, null);
				return;
			}

			let t = new Token();
			Object.assign(t, res[0]);

			call(callback, err, t);
		});
	}

	static getRequestUser (req, callback) {
		Token.getUserByTokenAndDeviceAndVerify(req[config.auth.tokenName], deviceId.get(req), callback);
	}

	static generate (user, device, callback) {
		Token.getByUserAndDevice(user, device, (err, token) => {
			if (err) {
				call(callback, null);
				return;
			}

			if (validate.objectNotEmpty(token)) {	// token exists

				token.generateAndSetToken(success => {
					if (success !== true) {
						call(callback, null);
						return;
					}

					token.update(success => {
						if (success !== true) {
							call(callback, null);
							return;
						}

						call(callback, token.token);
					});
				});

			} else {	// token does not exist

				token = new Token();
				token.user = user;
				token.device = device;

				token.generateAndSetToken(success => {
					if (success !== true) {
						call(callback, null);
						return;
					}

					token.persist(success => {
						if (success !== true) {
							call(callback, null);
							return;
						}

						call(callback, token.token);
					});
				});
			}
		});
	}
};