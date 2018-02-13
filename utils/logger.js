var winston = require('winston');
const fs = require('fs');
const logDir = 'log';

winston.emitErrs = true;
const tsFormat = () => (new Date()).toLocaleTimeString();

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            timestamp: tsFormat,
            level: 'info',
            filename: './log/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};