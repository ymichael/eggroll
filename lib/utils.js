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

/**
 * Returns the path of the module id of relative to the root
 * @param {string} moduleId
 * @param {string} root
 */
exports.getModulePath = function(moduleId, root) {
    return path.join(root, moduleId) + '.js';
};

/**
 * Returns a normalized moduleId.
 * @param {string} required
 * @param {stirng} currentModule
 */
exports.normalizeModuleId = function(required, currentModule) {
	return path.normalize(path.join(path.dirname(currentModule), required));
};
