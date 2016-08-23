"use strict";

const User = require("./../model/User");
const Token = require("./../model/Token");
const validate = require("./../util/general/validate");
const config = require("./../../config");
const deviceId = require("./../util/auth/deviceId");

module.exports = function (req, res, next) {
    let token = req.body[config.auth.tokenName] || req.query[config.auth.tokenName] || req.headers[config.auth.tokenName] || "";

    token = token.trim();

    if (!validate.stringNotEmpty(token)) {
        res.sendStatus(401);
        return;
    }

    Token.getUserByTokenAndDeviceAndVerify(token, deviceId.get(req), user => {
        if (!validate.objectNotEmpty(user)) {
            res.sendStatus(401);
            return;
        }

        req[config.auth.tokenName] = token;
        next();
    });
};
