/**
 * Bundling logic.
 */
var fs = require('fs');
var modules = require('./modules');
var dependency = require('./dependency');
var utils = require('./utils');

/**
 * Given a list of files, transform them and concatenate them in order.
 * @param {Array.<string>} files
 * @param {string} root
 * @param {string} prefix
 * @param {boolean} resolveDependencies Whether to resolve dependencies.
 */
exports.createBundle = function(files, root, prefix, resolveDependencies) {
    if (resolveDependencies) {
        var includedFiles = [];
        files.map(function(filePath) {
            return utils.getModuleId(filePath, root);
        }).map(function(moduleId) {
            return dependency.bundleDependencies(moduleId, root)
        }).map(function(moduleIds) {
            return moduleIds.map(function(moduleId) {
                return utils.getModulePath(moduleId, root);
            });
        }).forEach(function(filePaths) {
            filePaths.forEach(function(filePath) {
                if (includedFiles.indexOf(filePath) == -1) {
                    includedFiles.push(filePath);
                }
            });
        });
        files = includedFiles;
    }

    var transformedFiles = files.map(function(filePath) {
        return modules.processModule(
            fs.readFileSync(filePath, 'utf-8'),
            utils.getModuleId(filePath, root),
            prefix);
    });
    return transformedFiles.join('\n');
};
