/**
 * Code to parse the dependency tree of the given module.
 */
var path = require('path');
var fs = require('fs');
var utils = require('./utils');

var REQUIRE_RE = /require\(['"](.+?)['"]\)/g;

/**
 * Returns the set of required modules in the given source code in the order
 * they appear using a regular expression.
 * @param {string} sourceCode
 * @param {string} currentModule
 * @return {Array.<string>}
 */
var getRequiredModules = exports.getRequiredModules = function(sourceCode, currentModule) {
    var requiredModules = [];
    var moduleId;
    while ((match = REQUIRE_RE.exec(sourceCode)) !== null) {
        moduleId = utils.normalizeModuleId(match[1], currentModule);
        if (requiredModules.indexOf(moduleId) == -1) {
            requiredModules.push(moduleId);
        }
    }
    return requiredModules;
};

/**
 * Returns a toposorted list of dependencies from the given entry point.
 * @param {string} entryPoint Module id of the entry point.
 * @param {string} root path from which to resolve module ids
 * @return {Array.<string>}
 */
exports.bundleDependencies = function(entryPoint, root) {
    var toVisit = [[entryPoint, false /* add to dependency */]];
    var visited = {};
    var dependencies = [];
    var current,
        currentModuleId,
        shouldAddToDependency,
        currentPath,
        fileContents,
        requiredModules;

    while (toVisit.length) {
        current = toVisit.pop();
        currentModuleId = current[0];
        shouldAddToDependency = current[1];

        if (shouldAddToDependency) {
            dependencies.push(currentModuleId);
            continue;
        }

        if (visited[currentModuleId]) {
            continue;
        }

        visited[currentModuleId] = true;
        // Add this module as a dependency after all its deps are processed.
        toVisit.push([currentModuleId, true]);

        currentPath = path.join(root, currentModuleId + '.js');
        fileContents = fs.readFileSync(currentPath, 'utf-8');
        requiredModules = getRequiredModules(fileContents, currentModuleId);
        requiredModules.reverse();
        requiredModules.forEach(function(depId) {
            toVisit.push([depId, false]);
        });
    }

    return dependencies;
};
