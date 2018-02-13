function parseParam(url, parameters) {

    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const element = parameters[key];
            url = url.replace(`{${key}}`, element);
        }
    }

    return url;
}

module.exports = {
    parseParam
}