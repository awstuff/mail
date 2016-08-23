"use strict";

const validate = require("./../general/validate");

module.exports = {
	create (req, res, next) {
		let androidId = req.headers["android-id"];

		if (validate.stringNotEmpty(androidId)) {	// access via android app
			req._deviceId = "android##" + androidId.trim();
			next();
		} else {	// access via browser
			let ip = req.clientIp;
			let ua = req.headers["user-agent"];

			req._deviceId = ("web##" + ip + "##" + ua).trim();

			next();
		}
	},
	get (req) {
		return req._deviceId;
	}
};