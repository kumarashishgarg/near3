const config = require("./config.json");
const validator = require('./validators');

function parse(request) {
    const requestData = request.body;
    for (const key in requestData) {
        for (const keyofKey in requestData[key]) {
            const jsonPath = `${key}.${keyofKey}`;
            var validationObject = config.field.validation.find(x => x.name == jsonPath);

            // Validation Rule(s) exists
            if (validationObject) {
                const rules = validationObject.type.split(',');

                // const data = requestData[key][keyofKey];

                 validator.customValidator(request, jsonPath, rules);

            }
        }
    }
}

module.exports = {
    parse: parse
}
