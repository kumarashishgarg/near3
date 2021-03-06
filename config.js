module.exports = {
    doVersionApi: false,

    port: process.env.PORT || 3000,

    secret: 'PmSHtRVtR68qDPCRy4U9-XrYnEMs-I5u0IVk2soezPdhAxQfb434rBu4KUlVAJHT',

    tokenExpiresIn: 86400,

    db: {
        sess_interval: 3600,
        uri:
            process.env.MONGOLAB_URI ||
            process.env.COMPOSEMONGO_URL ||
           'mongodb://testuser:testuser@ds233228.mlab.com:33228/chatbox'
    }
}
