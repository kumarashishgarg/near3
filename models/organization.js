
//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    name: { type: String, required: true },
    defaultValue: { type: String }
});

module.exports = mongoose.model('Organization', OrganizationSchema );