"use strict";

const mkdirp = require("mkdirp");

module.exports = function () {
	if (!global.temporaryExportFolder) {
		console.log("export folder not specified, could not create.");
		return;
	}

	mkdirp(global.temporaryExportFolder, err => {
		if (err) {
			console.log("export folder could not be created.");
			return;
		}

		console.log("created export folder.");
	});
};