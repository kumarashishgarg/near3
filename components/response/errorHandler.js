var util = require('util');
 
function ValueOutOfRangeError(propertyName, actualValue, rangeMin, rangeMax) {
 
    /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object
 
    //Set the name for the ERROR 
    this.name = this.constructor.name; //set our function’s name as error name.
 
    //Define error message
    this.message = [
                     "Property with name |", 
                      propertyName ,
                      "| contains the value",
                      actualValue,
                      "which is outside the range:",
                      rangeMin, "to", rangeMax
                   ].join(" "); //Concat and make a string.
}
 
// inherit from Error
util.inherits(ValueOutOfRangeError, Error);
 
//Export the constructor function as the export of this module file.
exports = module.exports = ValueOutOfRangeError;