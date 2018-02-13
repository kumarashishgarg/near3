
function processResponse(request, response, apiOutput, isSuccess) {
    const data = request.body;
    var result = {};

    result.context = {
        "timestamp": response.timestamp || new Date(),
        "version": data['context']['version']
    };
 
    result.uiOutput = {
        "result": Object.keys(apiOutput ).length ? JSON.stringify(apiOutput) : (isSuccess ? response.result.fulfillment['speech'] : '')
    };

    result.restOutput = apiOutput;

    result.result = {
        "message": isSuccess ? 'SUCCESS' : 'FAIL',
        "statusCode": isSuccess ? 'SUC000' : (request.validationErrors().length > 0 ? 'REQ_VAL' : 'SER_ERR'),
        "error": isSuccess ? [] : {
            "errorDetails": response
        }
    };
    result.aiResponse = {
        "response": isSuccess ? response : {}
    }

    return result;
}

module.exports = processResponse;
