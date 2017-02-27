/**
 * Bundling logic.
 */
var fs = require('fs');
var modules = require('./modules');
var utils = require('./utils');

/**
 * Given a list of files, transform them and concatenate them in order.
 * @param {Array.<string>} files
 * @param {string} root
 * @param {string} prefix
 */
exports.createBundle = function(files, root, prefix) {
    var transformedFiles = files.map(function(filePath) {
        return modules.processModule(
            fs.readFileSync(filePath, 'utf-8'),
            utils.getModuleId(filePath, root),
            prefix);
    });
    return transformedFiles.join('\n');
};
