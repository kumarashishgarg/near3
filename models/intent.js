
//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

const IntentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('Intent', IntentSchema );