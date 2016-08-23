const $ = require("jquery");
const UserStore = require("./../../stores/UserStore");
const apiUrl = require("./../../config-values/apiUrl");
const requestDelay = require("./../../config-values/requestDelay");
const debugging = require("./../../config-values/debugging");
const routePaths = require("./../../config-values/routePaths");
const navigation = require("./../navigation");

let interceptors = [];

/**
 * Send a GET request
 * @param options Url and delay flag
 * @param success Success callback
 * @param error Error callback
 * @param final Finally callback
 */

function get (options, success, error, final) {
	let a = new Ajax(options, "get", success, error, final);
	a.send();
}

/**
 * Send a POST request
 * @param options Url, data and delay flag
 * @param success Success callback
 * @param error Error callback
 * @param final Finally callback
 */
function post (options, success, error, final) {
	let a = new Ajax(options, "post", success, error, final);
	a.send();
}

/**
 * Register an HTTP interceptor
 * @param interceptor The interceptor function
 */
function registerInterceptor (interceptor) {
	if (typeof interceptor !== "function") {
		log.err("Interceptor cannot be registered: It is not a function.");
		return;
	}

	interceptors.push(interceptor);
}

/**
 * Basic logging functionality
 */
let log = {
	warn (msg) {
		console.warn("_http.js: " + msg);
	},
	err (msg) {
		console.error("_http.js: " + msg);
	}
};

/**
 * Wrapper class around jQuery's $.ajax()
 */
class Ajax {
	constructor (options, method, success, error, final) {
		this.url = options.url;
		this.delay = options.delay === true;
		this.method = method;
		this.data = options.data;
		this.success = success;
		this.error = error;
		this.final = final;
		this.requestStartTime = 0;
		this.requestEndTime = 0;
	}

	send () {
		let self = this;

		let request = this.computeInterceptors({
			url: apiUrl + Ajax.generateNoCacheUrl(this.url),
			data: this.data ? this.data : {},
			headers: {}
		});

		this.requestStartTime = Date.now();

		$.ajax({
			url: request.url,
			method: self.method,
			dataType: "json",
			data: request.data,
			headers: request.headers,
			//cache: false,
			statusCode: {
				401: () => {
					console.warn("Request unauthorized, redirecting to sign in.");
					UserStore.logoutUser();
					navigation.goto(routePaths.signIn);
				}
			},
			success (res) {
				self.processDelay(() => {
					if (typeof self.success === "function") {
						self.success(res);
					}

					if (typeof self.final === "function") {
						self.final();
					}
				});
			},
			error () {
				self.processDelay(() => {
					if (typeof self.error === "function") {
						self.error();
					}

					if (typeof self.final === "function") {
						self.final();
					}
				});
			}
		});
	}


	computeInterceptors (request) {
		let requestLength = request.length;

		$.each(interceptors, (index, i) => {
			if (typeof i !== "function") {
				log.err("Interceptor cannot be called: It is not a function.");
				return;
			}

			let modifiedRequest = i(request);

			if (typeof modifiedRequest !== "object" || !modifiedRequest.hasOwnProperty("url") || !modifiedRequest.hasOwnProperty("data") || !modifiedRequest.hasOwnProperty("headers") || modifiedRequest.length !== requestLength) {
				log.warn("Interceptor does not return a valid request object and is thus skipped.");
				return;
			}

			request = modifiedRequest;
		});

		return request;
	}


	processDelay (callback) {
		if (this.delay !== true) {
			callback();
			return;
		}

		this.requestEndTime = Date.now();

		let executionTime  = this.requestEndTime - this.requestStartTime;

		let differenceToRequestDelay = requestDelay - executionTime;

		if (differenceToRequestDelay > 0 && differenceToRequestDelay <= requestDelay) {	// the second condition is just to be sure nothing bad happens
			if (debugging) {
				console.debug("delaying request by " + differenceToRequestDelay + " ms");
			}

			setTimeout(callback, differenceToRequestDelay);
		} else {
			callback();	// call immediately
		}
	}


	static generateNoCacheUrl (url) {
		let appendix = Date.now();

		if (url.indexOf("?") > -1) {
			return url + "&" + appendix;
		} else {
			return url + "?" + appendix;
		}
	}
}

module.exports = {
	get,
	post,
	registerInterceptor
};