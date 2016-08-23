"use strict";

const nodemailer = require("nodemailer");
const validate = require("./../general/validate");
const config = require("./../../../config");
const generateResetPasswordMail = require("./generateResetPasswordMail");

module.exports = function (to, id) {
	nodemailer.createTransport({
		host: config.smtp.host,
		port: config.smtp.port,
		auth: {
			user: config.smtp.userName,
			pass: config.smtp.password
		}
	}).sendMail({
		from: config.smtp.from,
		to: to,
		subject: "Reset password for Test Mail",
		html: generateResetPasswordMail(id)
	}, function (err) {
		if (validate.objectNotEmpty(err)) {
			console.log("sending password reset mail to " + to + " failed.");
			console.log(err);
		} else {
			console.log("sending password reset mail to " + to + " succeeded.");
		}
	});
};
