"use strict";

const UniqueLink = require("./../../../model/UniqueLink");
const validate = require("./../../../util/general/validate");

module.exports = function (req, res) {
	if (!req.body) {
		res.json({
			success: false
		});
		return;
	}

	let id = req.body.id;

	if (typeof id === "string" || id instanceof String) {
		id = id.trim();
	}

	if (!validate.stringNotEmpty(id)) {
		res.json({
			success: false
		});
		return;
	}

	UniqueLink.getById(id, (err, uniqueLink) => {
		if (err || !validate.objectNotEmpty(uniqueLink) || uniqueLink.used !== false || uniqueLink.isExpired()) {
			res.json({
				success: false
			});
			return;
		}

		res.json({
			success: true
		});
	});
};
