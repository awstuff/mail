"use strict";

module.exports = {
    db : {
        host : "localhost",
        user : "maildb",
        password : "...",
        database : "maildb"
    },
    apiPath: "api",
    port: 9909,
    smtp : {
        host : "...",
        port : 0,
        userName : "...",
        password : "...",
        from : "..."
    },
    auth: {
        secret: "...",
        tokenName: "token",
        passPhraseName: "cryptphrase",
        noDaysUniqueLinkIsValid: 2,
        passwordResetBaseLink: "http://localhost/mail/resetpassword/"
    },
    paginationPageLength: 20,
    defaultReplyHeader: "On $DATEEN$, $SENDER$ wrote:",
    defaultGlobalSignature: "This is the default global signature",
    temporaryExportFolderName: "tmpxprt",
    noHoursAttachmentLinkIsValid: 5,
    mysqlDateTimeStringFormat: "YYYY-MM-DD HH:mm"
};
