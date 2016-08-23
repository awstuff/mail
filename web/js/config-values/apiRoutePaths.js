const apiUrl = require("./apiUrl");

module.exports = {
	user: {
		register: "user/register",
		login: "user/login",
		loginWithToken: "user/loginwithtoken",
		resetPassword: {
			reset: "user/resetpassword/reset",
			setNew: "user/resetpassword/setnew",
			verifyLink: "user/resetpassword/verifylink"
		},
		changePassword: "user/changepassword"
	},
	account: {
		add: "account/add",
		edit: "account/edit",
		remove: "account/remove",
		setDefault: "account/setdefault",
		getDefault: "account/getdefault",
		getAllWithMailboxes: "account/getallwithmailboxes",
		getAllNotSortedByDefault: "account/getallnotsortedbydefault"
	},
	send: {
		new_: "send/new"
	},
	recipientCache: {
		get_: "recipientcache/get",
		setEnabled: "recipientcache/setenabled",
		isEnabled: "recipientcache/isenabled",
		clear: "recipientcache/clear"
	},
	replyHeader: {
		set_: "replyheader/set",
		get_: "replyheader/get",
		reset: "replyheader/reset"
	},
	signature: {
		setGlobal: "signature/setglobal"
		//setForAccount: "signature/setforaccount"
	},
	mailbox: {
		getAll: "mailbox/getall",
		getContents: "mailbox/getcontents",
		add: "mailbox/add",
		rename: "mailbox/rename",
		delete_: "mailbox/delete"
	},
	mail: {
		delete_: "/mailbox/mail/delete",
		move: "/mailbox/mail/move",
		get_: "/mailbox/mail/get",
		markAsSeen: "/mailbox/mail/markasseen",
		markAsNotSeen: "/mailbox/mail/markasnotseen",
		getAttachment: "/mailbox/mail/getattachment"
	}
};