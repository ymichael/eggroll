#!/usr/bin/env node
/**
 * cli.
 */
var index = require('../index');

require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .demandCommand(1, 'must provide a valid command')
    .command(
        'deps [options]',
        'Output the dependencies found for the given entry point',
        function(yargs) {
            yargs
                .option('entry', {
                    demandOption: true,
                    describe: 'module id of bundle entry point',
                    type: 'string',
                })
                .option('root', {
                    describe: 'root to resolve module ids',
                    default: process.cwd(),
                    type: 'string',
                });
        },
        function(argv) {
            console.log(
                index.dependency.bundleDependencies(argv.entry, argv.root));
        })
    .command(
        'bundle [options] <files...>',
        'Bundle the given files',
        function(yargs) {
            yargs
                .option('prefix', {
                    describe: 'custom prefix for module variables',
                    default: '$$module$$',
                    type: 'string',
                })
                .option('resolve', {
                    describe: 'whether to resolve dependencies',
                    default: false,
                    type: 'boolean',
                })
                .option('root', {
                    describe: 'root to resolve module ids',
                    default: process.cwd(),
                    type: 'string',
                });
        },
        function(argv) {
            var output = index.bundle.createBundle(
                argv.files,
                argv.root,
                argv.prefix,
                argv.resolve);
            console.log(output);
        })
    .argv;
