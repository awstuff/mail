/**
* simpleDateTime.js
*
* allows some simple date formatting as us-type-format (pass "us" as second param), de-type-format (pass "de") or iso-format (pass "iso")
* passing true as third parameter also returns the corresponding time
* passing true as fourth parameter stops errors from being thrown when date or format string are incorrect
* Copyright 2015 Adrian Wirth
* Released under the MIT license
*
* Date: 2015-12-29
*/

function simpleDateTime (date, format, displaytime, noerrors) {
	var months = {
		us : [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		de : [
			"Januar",
			"Februar",
			"März",
			"April",
			"Mai",
			"Juni",
			"Juli",
			"August",
			"September",
			"Oktober",
			"November",
			"Dezember"
		]
	};
	if (displaytime !== true) {
		displaytime = false;
	}
	if (noerrors !== true) {
		noerrors = false;
	}
	// basic type checks:
	if (typeof date === "string") {
		// utc corrections: TODO something's wrong here
		/* date = date.replace(/ /g, "T");
		date += "Z";
		date = new Date(date);
		date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); */
		date = new Date(date);
	}
	if (toString.call(date) !== "[object Date]" || date.toString().toLowerCase() === "invalid date") {
		if (!noerrors) throw "simpleDate.js: invalid date";
		return;
	}
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var h = date.getHours();
	var uh = date.getUTCHours();
	var min = date.getMinutes();
	// the actual formatting:
	switch (format) {
		case "us":
			return months.us[m] + " " + d + ", " + y + (displaytime ? " at " + getTimeAs12(h, formatToTwoDigits(min)) : "");
		case "de":
			return d + ". " + months.de[m] + " " + y + (displaytime ? " um " + formatToTwoDigits(h) + ":" + formatToTwoDigits(min) : "");
		case "iso":
			return y + "-" + formatToTwoDigits(m + 1) + "-" + formatToTwoDigits(d) + (displaytime ? "T" + formatToTwoDigits(uh) + ":" + formatToTwoDigits(min) : "");
		default:	// illegal format string
			if (!noerrors) throw "simpleDate.js: invalid format string";
			return;
	}
	// inserts a leading zero before the passed digit if needed and returns the result as a string, if changes were made, otherwise as passed to the function
	function formatToTwoDigits (val) {
		if (val.toString().length < 2) {
			val = "0" + val;
		}
		if (val.toString().length < 2) {
			if (!noerrors) throw "simpleDate.js: invalid day or month";
			return;
		}
		return val;
	}
	function getTimeAs12 (hours, minutes) {
		if (hours === 0) {
			return "12:" + minutes + " a.m.";
		}
		if (hours === 12) {
			return "12:" + minutes + " p.m.";
		}
		var ending = "a.m.";
		if (hours > 12) {
			hours -= 12;
			ending = "p.m.";
		}
		return formatToTwoDigits(hours) + ":" + minutes + " " + ending;
	}
}

module.exports = simpleDateTime;