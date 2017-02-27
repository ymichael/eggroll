/**
 * Module level functions for common.js modules.
 */
var recast = require('recast');
var transforms = require('./transforms');

/**
 * Processes the given module to prepare it for concatenation.
 * @param {string} sourceCode
 * @param {string} moduleName
 * @param {string} modulePrefix
 */
exports.processModule = function(sourceCode, moduleName, modulePrefix) {
    var ast = recast.parse(sourceCode);
    var localVariables = transforms.localVariables(ast);
    var moduleVariable = modulePrefix + moduleName;
    transforms.prefixVariables(ast, localVariables, moduleVariable);
    transforms.renameModuleExports(ast, moduleVariable);
    transforms.replaceRequireCalls(ast, modulePrefix);
    transforms.prependVariable(ast, moduleVariable);
    return recast.print(ast).code;
};
