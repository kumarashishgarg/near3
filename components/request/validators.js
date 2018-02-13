const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// Refer for default validators '../../node_modules/express-validator/shared-typings.d.ts'

function customValidator(request, jsonPath, rules) {

    rules.forEach(rule => {
        switch (rule) {

            case 'required':
                request.check(jsonPath, `${jsonPath} should not be empty.`).notEmpty();
                parseErrors(request);
                break;

            case 'date':
                request.check(jsonPath, `${jsonPath} should be a date.`).isISO8601();
                parseErrors(request);
                break;

            case 'alphanumeric':
                request.check(jsonPath, `${jsonPath} should contain alphanumeric or hyphen.`).isAlphanumeric();
                parseErrors(request);
                break;

            case 'hash':
                request.check(jsonPath, `${jsonPath} should contain alphanumeric or hyphen.`)
                .optional({ checkFalsy: true }).matches(/^[a-zA-Z0-9-_]+$/);
                parseErrors(request);
                break;

            case 'version':
                request.check(jsonPath, `${jsonPath} is Invalid value.`).matches(/^(\d+\.)?(\d+\.)?(\*|\d+)$/);
                parseErrors(request);
                break;

            case 'number':
                request.check(jsonPath, `${jsonPath} should be a number.`).matches(/\d/);
                parseErrors(request);
                break;

            case 'email':
                request.check(jsonPath, `${jsonPath} should be email.`).isEmail();
                parseErrors(request);
                break;

            default:
                console.log('Rule not defined');
        }
    });
    return request;

}

function parseErrors(req) {
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        // res.send(errors);
    } else {
        req.session.success = true;
    }

}

module.exports = {
    customValidator: customValidator
}
