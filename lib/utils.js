/**
 * Shared helpers.
 */
var path = require('path');

/**
 * Returns a string that is safe to use as a variable name.
 * @param {string} name
 */
exports.sanitizeVariableName = function(name) {
    return name.replace(/[./-]/g, '_');
};

/**
 * Returns the module id of a given file and root.
 * @param {string} filePath
 * @param {string} root
 */
exports.getModuleId = function(filePath, root) {
    return path.relative(root, filePath).slice(0, -1 * '.js'.length);
};
