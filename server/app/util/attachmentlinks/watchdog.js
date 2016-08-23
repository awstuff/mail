"use strict";

const AttachmentLink = require("./../../model/AttachmentLink");

module.exports = {
	start () {
		console.log("starting watchdog...");

		const interval = 15 * 60 * 1000;	// every 15 minutes

		let doStuff = () => {
			AttachmentLink.deleteExpiredLinks(success => {
				if (success !== true) {
					console.log(new Date() + " deleting expired attachment links failed");
					return;
				}

				console.log(new Date() + " successfully deleted expired attachment links");
			});
		};

		setInterval(doStuff, interval);

		doStuff();
	}
};