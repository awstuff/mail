"use strict";

const _ = require("lodash");

function processMailboxListTopLevel (boxes) {
	boxes = processMailboxList(boxes);

	// sort by attributes as well:

	let inboxFolders = [];
	let draftsFolders = [];
	let sentFolders = [];
	let junkFolders = [];
	let trashFolders = [];
	let archiveFolders = [];
	let otherFolders = [];

	_.forEach(boxes, box => {

		if (box.isInboxFolder) {
			inboxFolders.push(box);
		} else if (box.isDraftsFolder) {
			draftsFolders.push(box);
		} else if (box.isSentFolder) {
			sentFolders.push(box);
		} else if (box.isJunkFolder) {
			junkFolders.push(box);
		} else if (box.isTrashFolder) {
			trashFolders.push(box);
		} else if (box.isArchiveFolder) {
			archiveFolders.push(box);
		} else {
			otherFolders.push(box);
		}

	});


	return inboxFolders.concat(draftsFolders, sentFolders, junkFolders, trashFolders, archiveFolders, otherFolders);
}

function processMailboxList (boxes) {
	let output = [];

	_.forEach(boxes, (properties, name) => {	// map boxes
		let children = [];

		if (properties.children) {	// process children
			children = processMailboxList(properties.children);
		}

		var currentBox = Object.assign({
			name,
			children
		}, processAttributes(properties.attribs));

		let nameToLowerCase = name.toLowerCase();

		if (nameToLowerCase === "inbox") {	// some kind of dirty hack
			currentBox.isInboxFolder = true;
		//} else if (nameToLowerCase === "draft") {
		//	currentBox.isDraftsFolder = true;
		//} else if (nameToLowerCase === "drafts") {
		//	currentBox.isDraftsFolder = true;
		//} else if (nameToLowerCase === "sent") {
		//	currentBox.isSentFolder = true;
		//} else if (nameToLowerCase === "junk") {
		//	currentBox.isJunkFolder = true;
		//} else if (nameToLowerCase === "spam") {
		//	currentBox.isJunkFolder = true;
		//} else if (nameToLowerCase === "trash") {
		//	currentBox.isTrashFolder = true;
		//} else if (nameToLowerCase === "archive") {
		//	currentBox.isArchiveFolder = true;
		}

		output.push(currentBox);
	});

	sortBoxes(output);	// sort

	return output;
}

function processAttributes (attribs) {	// process attributes
	let output = {};

	_.forEach(attribs, attr => {

		switch (attr) {
			case "\\Trash":
				output.isTrashFolder = true;
				break;

			case "\\Sent":
				output.isSentFolder = true;
				break;

			case "\\Inbox":
				output.isInboxFolder = true;
				break;

			case "\\Drafts":
				output.isDraftsFolder = true;
				break;

			case "\\Archive":
				output.isArchiveFolder = true;
				break;

			case "\\Junk":
				output.isJunkFolder = true;
				break;
		}

	});

	return output;
}

function sortBoxes (boxes) {	// sort mailboxes alphabetically
	boxes.sort((a, b) => {
		let aName = a.name.toLowerCase();
		let bName = b.name.toLowerCase();

		if (aName < bName) {
			return -1;
		}

		if (aName > bName) {
			return 1;
		}

		return 0;
	});
}

module.exports = processMailboxListTopLevel;