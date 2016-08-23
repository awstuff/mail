"use strict";

const CryptoJS = require("crypto-js");
const config = require("./../../../config");

function doWork (req, password, methodName, toStringArguments) {
	let passPhrase = req.headers[config.auth.passPhraseName];

	if (!passPhrase) {
		return "";
	}

	passPhrase = passPhrase.trim();

	if (!passPhrase.length) {
		return "";
	}

	let result = CryptoJS.AES[methodName](password, passPhrase).toString(toStringArguments);

	passPhrase = null;

	return result;
}

module.exports = {
	decrypt (req, password) {
		return doWork(req, password, "decrypt", CryptoJS.enc.Utf8);
	},

	encrypt (req, password) {
		return doWork(req, password, "encrypt", void 0);
	}
};