"use strict";

const routes = {
    authMiddleware: require("./routes/authMiddleware"),
    online: require("./routes/online"),
    user: {
        register: require("./routes/user/register"),
        login: require("./routes/user/login"),
        loginwithtoken: require("./routes/user/loginwithtoken"),
        changepassword: require("./routes/user/changepassword"),
        resetpassword: {
            reset: require("./routes/user/resetpassword/reset"),
            setnew: require("./routes/user/resetpassword/setnew"),
            verifylink: require("./routes/user/resetpassword/verifylink")
        }
    },
    account: {
        add: require("./routes/account/add"),
        edit: require("./routes/account/edit"),
        remove: require("./routes/account/remove"),
        setdefault: require("./routes/account/setdefault"),
        getdefault: require("./routes/account/getdefault"),
        getallwithmailboxes: require("./routes/account/getallwithmailboxes"),
        getallnotsortedbydefault: require("./routes/account/getallnotsortedbydefault")
    },
    send: {
        new_: require("./routes/send/new")
    },
    recipientCache: {
        get: require("./routes/recipientcache/get"),
        setenabled: require("./routes/recipientcache/setenabled"),
        clear: require("./routes/recipientcache/clear"),
        isenabled: require("./routes/recipientcache/isenabled")
    },
    replyHeader: {
        set: require("./routes/replyheader/set"),
        get: require("./routes/replyheader/get"),
        reset: require("./routes/replyheader/reset")
    },
    signature: {
        setglobal: require("./routes/signature/setglobal")
        //setforaccount: require("./routes/signature/setforaccount")
    },
    mailbox: {
        getall: require("./routes/mailbox/getall"),
        getcumulatedinboxcontents: require("./routes/mailbox/getcumulatedinboxcontents"),
        getcontents: require("./routes/mailbox/getcontents"),
        searchcontents: require("./routes/mailbox/searchcontents"),
        exportcontents: require("./routes/mailbox/exportcontents"),
        add: require("./routes/mailbox/add"),
        rename: require("./routes/mailbox/rename"),
        delete_: require("./routes/mailbox/delete"),
        mail: {
            delete_: require("./routes/mailbox/mail/delete"),
            move: require("./routes/mailbox/mail/move"),
            get: require("./routes/mailbox/mail/get"),
            markasseen: require("./routes/mailbox/mail/markasseen"),
            markasnotseen: require("./routes/mailbox/mail/markasnotseen"),
            getattachment: require("./routes/mailbox/mail/getattachment")
        }
    }
};

module.exports = function (router) {
    router.get("/online", (req, res) => {
        routes.online(req, res);
    });

    router.post("/user/register", (req, res) => {
        routes.user.register(req, res);
    });
    router.post("/user/login", (req, res) => {
        routes.user.login(req, res);
    });
    router.post("/user/loginwithtoken", (req, res) => {
        routes.user.loginwithtoken(req, res);
    });
    router.post("/user/resetpassword/reset", (req, res) => {
        routes.user.resetpassword.reset(req, res);
    });
    router.post("/user/resetpassword/setnew", (req, res) => {
        routes.user.resetpassword.setnew(req, res);
    });
    router.post("/user/resetpassword/verifylink", (req, res) => {
        routes.user.resetpassword.verifylink(req, res);
    });


    router.use((req, res, next) => {
        routes.authMiddleware(req, res, next);
    });


    router.post("/user/changepassword", (req, res) => {
        routes.user.changepassword(req, res);
    });

    router.post("/account/add", (req, res) => {
        routes.account.add(req, res);
    });
    router.post("/account/edit", (req, res) => {
        routes.account.edit(req, res);
    });
    router.post("/account/remove", (req, res) => {
        routes.account.remove(req, res);
    });
    router.post("/account/setdefault", (req, res) => {
        routes.account.setdefault(req, res);
    });
    router.get("/account/getdefault", (req, res) => {
        routes.account.getdefault(req, res);
    });
    router.get("/account/getallwithmailboxes", (req, res) => {
        routes.account.getallwithmailboxes(req, res);
    });
    router.get("/account/getallnotsortedbydefault", (req, res) => {
        routes.account.getallnotsortedbydefault(req, res);
    });

    router.post("/send/new", (req, res) => {
        routes.send.new_(req, res);
    });

    router.get("/recipientcache/get", (req, res) => {
        routes.recipientCache.get(req, res);
    });
    router.post("/recipientcache/setenabled", (req, res) => {
        routes.recipientCache.setenabled(req, res);
    });
    router.post("/recipientcache/clear", (req, res) => {
        routes.recipientCache.clear(req, res);
    });
    router.get("/recipientcache/isenabled", (req, res) => {
        routes.recipientCache.isenabled(req, res);
    });


    router.post("/replyheader/set", (req, res) => {
        routes.replyHeader.set(req, res);
    });
    router.get("/replyheader/get", (req, res) => {
        routes.replyHeader.get(req, res);
    });
    router.post("/replyheader/reset", (req, res) => {
        routes.replyHeader.reset(req, res);
    });

    router.post("/signature/setglobal", (req, res) => {
        routes.signature.setglobal(req, res);
    });
    //router.post("/signature/setforaccount", (req, res) => {
    //    routes.signature.setforaccount(req, res);
    //});

    router.post("/mailbox/getall", (req, res) => {
        routes.mailbox.getall(req, res);
    });
    router.get("/mailbox/getcumulatedinboxcontents", (req, res) => {
        routes.mailbox.getcumulatedinboxcontents(req, res);
    });
    router.post("/mailbox/getcontents", (req, res) => {
        routes.mailbox.getcontents(req, res);
    });
    router.post("/mailbox/searchcontents", (req, res) => {
        routes.mailbox.searchcontents(req, res);
    });
    router.post("/mailbox/exportcontents", (req, res) => {
        routes.mailbox.exportcontents(req, res);
    });
    router.post("/mailbox/add", (req, res) => {
        routes.mailbox.add(req, res);
    });
    router.post("/mailbox/rename", (req, res) => {
        routes.mailbox.rename(req, res);
    });
    router.post("/mailbox/delete", (req, res) => {
        routes.mailbox.delete_(req, res);
    });

    router.post("/mailbox/mail/delete", (req, res) => {
        routes.mailbox.mail.delete_(req, res);
    });
    router.post("/mailbox/mail/move", (req, res) => {
        routes.mailbox.mail.move(req, res);
    });
    router.post("/mailbox/mail/get", (req, res) => {
        routes.mailbox.mail.get(req, res);
    });
    router.post("/mailbox/mail/markasseen", (req, res) => {
        routes.mailbox.mail.markasseen(req, res);
    });
    router.post("/mailbox/mail/markasnotseen", (req, res) => {
        routes.mailbox.mail.markasnotseen(req, res);
    });
    router.post("/mailbox/mail/getattachment", (req, res) => {
        routes.mailbox.mail.getattachment(req, res);
    });
};
