"use strict";

const del = require("del");

module.exports = function (exportId) {
	let noExportId;

	if (!exportId) {
		noExportId = true;
		exportId = "*";
	} else {
		noExportId = false;
		exportId += "/*";
	}

	if (!global.temporaryExportFolder) {
		console.log("export folder not specified, could not delete contents.");
		return;
	}

	del([global.temporaryExportFolder + "/" + exportId]).then(() => {
		if (noExportId) {
			console.log("deleted all export folder contents.");
			return;
		}

		console.log("deleted export folder contents (subfolder " + exportId + ").");
	});
};