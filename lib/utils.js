/**
 * Shared helpers.
 */

/**
 * Returns a string that is safe to use as a variable name.
 * @param {string} name
 */
exports.sanitizeVariableName = function(name) {
    return name.replace(/[./]/g, '_');
};
