"use strict";

const nodemailer = require("nodemailer");
const call = require("./../general/call");
const crypt = require("./../auth/crypt");

module.exports = function (req, connectionData, callback) {
	let transporter = nodemailer.createTransport({
		host: connectionData.host,
		port: connectionData.port,
		auth: {
			user: connectionData.userName,
			pass: crypt.decrypt(req, connectionData.password)
		},
		secure: connectionData.tls
	});

	transporter.verify((err, success) => {
		if (err) {
			call(callback, err.response, false, null);
			return;
		}

		if (success !== true) {
			call(callback, "", false, null);
			return;
		}

		call(callback, null, true, transporter);
	});
};