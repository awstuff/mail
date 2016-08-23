"use strict";

const Imap = require("imap");
const call = require("./../general/call");
const crypt = require("./../auth/crypt");

module.exports = function (req, connectionData, callback) {
	let imapConnection = new Imap({
		user: connectionData.userName,
		password: crypt.decrypt(req, connectionData.password),
		host: connectionData.host,
		port: connectionData.port,
		tls: connectionData.tls,
		connTimeout: 20000,
		authTimeout: 10000,
		debug: console.log
	});

	imapConnection.connect();

	imapConnection.once("error", function (err) {
		console.log(err);

		call(callback, "Authentication for IMAP failed", false, null);
	});

	imapConnection.once("ready", function () {
		call(callback, null, true, imapConnection);
	});
};