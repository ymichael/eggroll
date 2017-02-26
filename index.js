#!/usr/lib/env node

var fs = require('fs');
var modules = require('./lib/modules');

var MODULE_PREFIX = '$$module$$';

if (require.main === module) {
    var args = process.argv.slice(2);
    if (args.length == 0) {
        return;
    }

    var sourceCode = fs.readFileSync(args[0], 'utf-8');
    var moduleName = 'foo';
    console.log(modules.processModule(sourceCode, moduleName, MODULE_PREFIX));
}
