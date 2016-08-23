"use strict";

const _ = require("lodash");

const runValidation = (input, validation) => {
    if (_.isArray(input)) {
        return input.length > 0 && _.every(input, validation);
    }
    return validation(input);
};

const validateObj = {
    stringNotEmpty (input) {
        return runValidation(input, e => {
            if (typeof e !== "string" && !(e instanceof String)) {
                return false;
            }
            e = e.trim();
            return e.length > 0;
        });
    },

    stringRequiredAndMaxLength255 (input) {
        return runValidation(input, e => {
            return this.stringNotEmpty(e) && e.length <= 255;
        });
    },

    stringOnlyLettersAndNumbers (input) {
        return runValidation(input, e => {
            return this.stringNotEmpty(e) && /^[a-z0-9]+$/i.test(e);
        });
    },

    isValidEmail (input) {
        return runValidation(input, e => {
            return this.stringNotEmpty(e) && /[A-Za-z0-9!#$%&'*+-/=?^_`{|}~]+@[A-Za-z0-9-]+(.[A-Za-z0-9-]+)*/i.test(e);
        });
    },

    objectNotEmpty (o) {
        if (o === null || o === void 0) {
            return false;
        }
        if (o.length > 0) {
            return true;
        }
        if (o.length === 0) {
            return false;
        }
        return _.every(o, (value, key) => {
            return _.has(o, key);
        });
    },

    hasStringProperties (obj, props) {
        return _.every(props, prop => {
            return _.has(obj, prop) && this.stringNotEmpty(obj[prop]);
        });
    }
};

module.exports = validateObj;
