"use strict";

const User = require("./../../model/User");
const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");
const deviceId = require("./../../util/auth/deviceId");
const config = require("./../../../config");

module.exports = function (req, res) {
    let eMail = req.body.eMail;
    let password = req.body.password;

    if (typeof eMail === "string" || eMail instanceof String) {
        eMail = eMail.trim();
    }
    if (typeof password === "string" || password instanceof String) {
        password = password.trim();
    }

    if (!validate.stringRequiredAndMaxLength255([
        eMail,
        password
    ]) || !validate.isValidEmail(eMail)) {
        res.json({
            success: false
        });
        return;
    }

    User.eMailExists(eMail, (err, exists) => {
        if (err || exists !== false) {
           res.json({
               success: false,
               errorMessage: "Email already registered"
           });
           return;
        }

        let user = new User();

        user.eMail = eMail;
        user.replyHeader = config.defaultReplyHeader;
        user.globalSignature = config.defaultGlobalSignature;
        user.hashAndSetPassword(password, err => {
            if (err) {
                res.json({
                    success: false,
                    errorMessage: "Internal error"
                });
                return;
            }

            user.persist((success, insertedUser) => {
                console.log(insertedUser);

                if (success !== true || !validate.objectNotEmpty(insertedUser)) {
                    res.json({
                        success: false,
                        errorMessage: "Database error"
                    });
                    return;
                }

                console.log('user "' + eMail + '" (id ' + insertedUser.id + ') registered successfully.');

                Token.generate(insertedUser.id, deviceId.get(req), generatedToken => {
                    if (!validate.stringNotEmpty(generatedToken)) {
                        res.json({
                            success: false,
                            errorMessage: "Could not perform automatic login"
                        });
                        return;
                    }

                    console.log('user "' + eMail + '" (id ' + insertedUser.id + ') logged in successfully after registration.');

                    res.json({
                        id: insertedUser.id,
                        eMail: insertedUser.eMail,
                        token: generatedToken,
                        globalSignature: insertedUser.globalSignature,
                        replyHeader: insertedUser.replyHeader,
                        defaultAccount: insertedUser.defaultAccount
                    });
                });
            })
        });
    });
};
