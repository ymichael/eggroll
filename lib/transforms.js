/**
 * AST Transformations for common.js modules.
 */
var recast = require('recast');
var types = require('ast-types');
var b = types.builders;
var n = types.namedTypes;
var utils = require('./utils');

/**
 * Returns a map of local variables in the current ast.
 * @param {types.File} ast
 * @returns {Object.<string, boolean>}
 */
exports.localVariables = function(ast) {
    var ret = {};
    types.visit(ast, {
        visitVariableDeclarator: function(path) {
            ret[path.node.id.name] = true;
            return false;
        }
    });
    return ret;
};

/**
 * Renames the variables by prefixing them with the a custom string. This
 * function mutates the given ast.
 * @param {types.File} ast
 * @param {Object.<string, boolean>} variablesToRename
 * @param {string} prefix
 */
exports.prefixVariables = function(ast, variablesToRename, prefix) {
    types.visit(ast, {
        visitIdentifier: function(path) {
            // hasOwnProperty might have been clobbered in variablesToRename.
            if (!Object.prototype.hasOwnProperty.call(variablesToRename, path.node.name)) {
                this.traverse(path);
                return;
            }

            if (path.name == 'key' ||
                    (path.name == 'property' && !path.parentPath.value.computed)) {
                this.traverse(path);
                return;
            }

            var newName = utils.sanitizeVariableName(prefix + path.node.name);
            var newIdentifier = b.identifier(newName);
            path.replace(newIdentifier);
            return false;
        }
    });
};

/**
 * Rename module.exports and exports.* references.
 * @param {types.File} ast
 * @param {string} variableName
 */
exports.renameModuleExports = function(ast, variableName) {
    variableName = utils.sanitizeVariableName(variableName);
    types.visit(ast, {
        visitMemberExpression: function(path) {
            if (n.Identifier.check(path.node.object) &&
                    path.node.object.name == 'exports') {
                var replacementNode = b.memberExpression(
                    b.identifier(variableName), path.node.property, false)
                path.replace(replacementNode);
                return false;
            }

            if (n.Identifier.check(path.node.object) &&
                    path.node.object.name == 'module') {
                path.replace(b.identifier(variableName));
                return false;
            }

            this.traverse(path);
        }
    });
};

/**
 * Replace require calls with static variable.
 * @param {types.File} ast
 * @param {string} modulePrefix
 * @param {string} currentModule
 */
exports.replaceRequireCalls = function(ast, modulePrefix, currentModule) {
    types.visit(ast, {
        visitCallExpression: function(path) {
            if (path.node.callee.name == 'require') {
                var mid = path.node.arguments[0].value;
                var normalizedId = utils.normalizeModuleId(mid, currentModule);
                var name = modulePrefix + normalizedId;
                // Sanitize the variable names because module ids are
                // potentially unsafe as variable names.
                name = utils.sanitizeVariableName(name);
                var replacementNode = b.identifier(name);
                path.replace(replacementNode);
                return false;
            }
            this.traverse(path);
        }
    });
};

/**
 * Prepend variable declaration to the ast.
 * @param {types.File} ast
 * @param {string} variableName
 */
exports.prependVariable = function(ast, variableName) {
    variableName = utils.sanitizeVariableName(variableName);
    var varStatement = b.variableDeclaration('var', [
        b.variableDeclarator(b.identifier(variableName), null)
    ]);
    ast.program.body.unshift(varStatement);
};
