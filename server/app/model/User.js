"use strict";

const hasher = require("password-hash-and-salt");
const validate = require("./../util/general/validate");
const call = require("./../util/general/call");
const toBoolean = require("./../util/general/toBoolean");

module.exports = class User {
    constructor () {
        this.id
            = this.defaultAccount
            = 0;

        this.eMail
            = this.hashedPassword
            = this.globalSignature
            = null;

        this.recipientCacheEnabled = true;

        this.replyHeader = "";
    }

    hashAndSetPassword (password, callback) {
        hasher(password).hash((err, hashedPassword) => {
            if (err || !validate.stringNotEmpty(hashedPassword)) {
                call(callback, true);
                return;
            }

            this.hashedPassword = hashedPassword;
            call(callback, false);
        });
    }

    persist (callback) {
        global.db.query("insert into users (eMail, hashedPassword, defaultAccount, recipientCacheEnabled, globalSignature, replyHeader) values (?, ?, ?, ?, ?, ?)", [this.eMail, this.hashedPassword, this.defaultAccount, this.recipientCacheEnabled, this.globalSignature, this.replyHeader], (err, info) => {
            if (err || !info.insertId) {
                call(callback, false, null);
                return;
            }

            User.getById(info.insertId, (err, user) => {    // get inserted user by id
                if (err || !validate.objectNotEmpty(user) || user.eMail !== this.eMail) {
                    call(callback, false, null);
                    return;
                }

                call(callback, true, user);
            });
        });
    }

    update (callback) {
        global.db.query("update users set eMail = ?, hashedPassword = ?, defaultAccount = ?, recipientCacheEnabled = ?, globalSignature = ?, replyHeader = ? where id = ?", [this.eMail, this.hashedPassword, this.defaultAccount, this.recipientCacheEnabled, this.globalSignature, this.replyHeader, this.id], err => {
            if (err) {
                call(callback, false);
                return;
            }

            call(callback, true);
        });
    }

    verifyPassword (password, callback) {
        hasher(password).verifyAgainst(this.hashedPassword, (err, valid) => {
            if (err || valid !== true) {
                call(callback, false);
                return;
            }

            call(callback, true);
        });
    }

    static dbEntryToAccount (d) {
        let user = new User();

        user.id = +d.id;
        user.defaultAccount = +d.defaultAccount;
        user.eMail = d.eMail;
        user.hashedPassword = d.hashedPassword;
        user.globalSignature = d.globalSignature;
        user.replyHeader = d.replyHeader;
        user.recipientCacheEnabled = toBoolean(d.recipientCacheEnabled);

        return user;
    }

    static getByEmail (eMail, callback) {
        global.db.query("select * from users where eMail = ?", [eMail], (err, res) => {
            if (err || res.length !== 1) {
                call(callback, err, null);
                return;
            }

            let user = User.dbEntryToAccount(res[0]);

            call(callback, err, user);
        });
    }

    static getById (id, callback) {
        global.db.query("select * from users where id = ?", [id], (err, res) => {
            if (err || res.length !== 1) {
                call(callback, err, null);
                return;
            }

            let user = User.dbEntryToAccount(res[0]);

            call(callback, err, user);
        });
    }

    static eMailExists (eMail, callback) {
        this.getByEmail(eMail, (err, res) => {
            if (err) {
                call(callback, err, false, null);
            }

            if (res !== null) {
                call(callback, null, true, res);
                return;
            }

            call(callback, null, false, null);
        });
    }
};