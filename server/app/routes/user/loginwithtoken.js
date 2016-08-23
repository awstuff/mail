"use strict";

const User = require("./../../model/User");
const Token = require("./../../model/Token");
const validate = require("./../../util/general/validate");
const deviceId = require("./../../util/auth/deviceId");

module.exports = function (req, res) {
    let token = req.body.token;

    if (typeof token === "string" || token instanceof String) {
        token = token.trim();
    }

    if (!validate.stringNotEmpty(token)) {
        res.json({
            success: false
        });
        return;
    }

    Token.getUserByTokenAndDeviceAndVerify(token, deviceId.get(req), user => {

        if (!validate.objectNotEmpty(user)) {
            res.json({
                success: false
            });
            return;
        }

        Token.generate(user.id, deviceId.get(req), generatedToken => {
            if (!validate.stringNotEmpty(generatedToken)) {
                res.json({
                    success: false
                });
                return;
            }

            console.log('user "' + user.eMail + '" (id ' + user.id + ') logged in successfully via token.');

            res.json({
                id: user.id,
                eMail: user.eMail,
                token: generatedToken,
                globalSignature: user.globalSignature,
                replyHeader: user.replyHeader,
                defaultAccount: user.defaultAccount
            });
        });
    });
};
