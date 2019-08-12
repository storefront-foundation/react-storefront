/**
 * Prints an error stack trace, a custom message, and exits with code 1.
 * 
 * @param {Object} err The error object.
 * @param {string} msg The message to be printed.
 */
const handleError = (err, msg) => {
    console.log(err.stack);
    console.log(msg);
    process.exit(1);
};

module.exports = handleError;
