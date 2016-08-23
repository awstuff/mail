"use strict";

const User = require("./../../model/User");
const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");
const deviceId = require("./../../util/auth/deviceId");

module.exports = function (req, res) {
    let eMail = req.body.eMail;
    let password = req.body.password;

    if (typeof eMail === "string" || eMail instanceof String) {
        eMail = eMail.trim();
    }
    if (typeof password === "string" || password instanceof String) {
        password = password.trim();
    }

    if (!validate.stringNotEmpty([
        eMail,
        password
    ])) {
        res.json({
            success: false
        });
        return;
    }

    User.getByEmail(eMail, (err, foundUser) => {
        if (err || !validate.objectNotEmpty(foundUser)) {
            res.json({
                success: false
            });
            return;
        }

        foundUser.verifyPassword(password, valid => {
            if (valid !== true) {
                res.json({
                    success: false
                });
                return;
            }

            Token.generate(foundUser.id, deviceId.get(req), generatedToken => {
                if (!validate.stringNotEmpty(generatedToken)) {
                    res.json({
                        success: false
                    });
                    return;
                }

                console.log('user "' + eMail + '" (id ' + foundUser.id + ') logged in successfully.');

                res.json({
                    id: foundUser.id,
                    eMail: foundUser.eMail,
                    token: generatedToken,
                    globalSignature: foundUser.globalSignature,
                    replyHeader: foundUser.replyHeader,
                    defaultAccount: foundUser.defaultAccount
                });
            });
        });
    });
};
