const localStorageKeys = require("./../../config-values/localStorageKeys");

module.exports = function (request) {
	request.headers.token = localStorage[localStorageKeys.token];
	request.headers.cryptphrase = localStorage[localStorageKeys.passphrase];

	return request;
};