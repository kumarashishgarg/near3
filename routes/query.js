var express = require('express');
var router = express.Router();
var bot = require('apiai');
var restClient = require('../utils/restClient');
var Intent = require('../models/intent')
var helper = require('../utils/helper');
var Organization = require('../models/organization');

var requestParser = require('../components/request/parser');
const processResponse = require('../components/response/responseHandler');
const uuidv1 = require('uuid/v1');

router.get("/", function (req, res) {
    res.send('Testing GET');
});


router.post("/", function (req, res) {

    const data = req.body;
    const requestResult = requestParser.parse(req);

    const errors = req.validationErrors();
    if (errors) {
        const result = processResponse(req, errors, {}, false);
        res.send(result);
    } else {
        const context = data['context'];
        const aiProvider = data['aiProvider'];
        const userData = data['data'];

        // Read the configuration for validation rules and apply validation on properties.
        // If validation rules fails, return the error context and terminate the request.

        // Checks for active session or generate new session id
        const sessionId = aiProvider['sessionId'] || uuidv1();
        var apiai = bot(aiProvider['accessToken']);

        // Calls DialogFlow API after data validation is done
        var request = apiai.textRequest(userData['queryText'], {
            sessionId: sessionId
        });

        // Callback on request process
        request.on('response', function (response) {

            // Validation on Score and further API call decision.
            const parameters = response.result.parameters;
            const actionIncomplete = response.result.actionIncomplete;
            const intentName = response.result.metadata.intentName || '';
            const actionName = response.result.action || null;

            // Concat the parameters
            let params = Object.assign({}, userData['backendParams'], parameters);

            if (intentName && !actionIncomplete) {
                Intent.findOne({ name: actionName }).then(result => {
                    if (result) {
                        const auth_type = result._doc['auth_type'] || null;
                        const additionalHeader = result._doc['headers'] || null;

                        if (result.type === "GET") {

                            const url = helper.parseParam(result.url, params);


                            restClient.get(url, auth_type, additionalHeader).then(data => {
                                const result = processResponse(req, response, data, true);
                                res.send(result);
                            });
                        }
                        else if (result.type === "POST") {
                            let payload = result._doc['payload'] || null;

                            for (const key in payload) {
                                if (payload.hasOwnProperty(key)) {
                                    const value = params[key];
                                    payload[key] = value;
                                }
                            }

                            const url = helper.parseParam(result.url, params);

                            restClient.post(url, payload, auth_type, additionalHeader).then(data => {
                                const result = processResponse(req, response, data, true);
                                res.send(result);
                            })
                        }
                    }
                    else {
                        const orgId = userData['orgId'];
                        Organization.findOne({ name: orgId }).then(response2 => {
                            var returnText = response2 ? response2['defaultValue'] : 'This is the global default message.'
                            const result = processResponse(req, response, returnText, true);
                            res.send(result);
                        });
                    }
                })
            }
            else {
                const result = processResponse(req, response, {}, true);
                res.send(result);
            }
        });

        // Callback on Server Error
        request.on('error', function (error) {
            const result = processResponse(req, error, false);
            res.send(result);
            //throw new Error(error.responseBody);
        });

        request.end();
    }
});

module.exports = router;
