const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

function connect(dbUrl, cb) {
    mongoose.connect(dbUrl, { useMongoClient: true })

    return new Promise((resolve, reject) => {
        mongoose.connection.on('error', (err) => {
            mongoose.disconnect()
            reject(err)
        })

        mongoose.connection.on('openUri', () => resolve(dbUrl))
    })
}

module.exports = {
    connect: connect
}
