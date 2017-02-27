var expect = require('expect.js');
var recast = require('recast');
var types = require('ast-types');
var b = types.builders;
var n = types.namedTypes;
var transforms = require('../../lib/transforms');

var sourceCodeToAst = function(sourceCode) {
    return recast.parse(sourceCode);
};

describe('transforms', function() {
    describe('localVariables', function() {
        it('should return a dictionary of the local variables found.', function() {
            var ast = sourceCodeToAst('var a, b, c;');
            expect(transforms.localVariables(ast)).to.eql({
                'a': true, 'b': true, 'c': true
            });
        });

        it('should support multiple declarations', function() {
            var ast = sourceCodeToAst('var a; b; var c = 5;');
            expect(transforms.localVariables(ast)).to.eql({'a': true, 'c': true});
        });

        it('should ignore global variables', function() {
            var ast = sourceCodeToAst('var a, b; c;');
            expect(transforms.localVariables(ast)).to.eql({'a': true, 'b': true});
        });
    });

    describe('prefixVariables', function() {
        it('should prefix the given variables', function() {
            var ast = sourceCodeToAst('var a;');
            var expectedAst = sourceCodeToAst('var testa;');
            transforms.prefixVariables(ast, {a: true}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should only prefix the given variables', function() {
            var ast = sourceCodeToAst('var a, b, c;');
            var expectedAst = sourceCodeToAst('var testa, b, testc;');
            transforms.prefixVariables(ast, {a: true, c: true}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should only prefix computed keys', function() {
            var ast = sourceCodeToAst('var a, b = {a: 5}; b[a] = 4;');
            var expectedAst = sourceCodeToAst('var testa, b = {a: 5}; b[testa] = 4;');
            transforms.prefixVariables(ast, {a: true}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should not prefix properties', function() {
            var ast = sourceCodeToAst('var a, b = c.a;');
            var expectedAst = sourceCodeToAst('var testa, b = c.a;');
            transforms.prefixVariables(ast, {a: true}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should handle inherited properties on Object correctly', function() {
            var ast = sourceCodeToAst('constructor.foo();');
            var expectedAst = sourceCodeToAst('constructor.foo();');
            transforms.prefixVariables(ast, {}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);

            ast = sourceCodeToAst('constructor.foo();');
            expectedAst = sourceCodeToAst('testconstructor.foo();');
            transforms.prefixVariables(ast, {'constructor': true}, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });
    });

    describe('renameModuleExports', function() {
        it('should replace exports', function() {
            var ast = sourceCodeToAst('exports.foo = 5;');
            var expectedAst = sourceCodeToAst('$$module$$.foo = 5;');
            transforms.renameModuleExports(ast, '$$module$$');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should replace multiple exports', function() {
            var ast = sourceCodeToAst('exports.foo = 5; exports.bar = 4;');
            var expectedAst = sourceCodeToAst('test.foo = 5; test.bar = 4;');
            transforms.renameModuleExports(ast, 'test');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should replace module.exports', function() {
            var ast = sourceCodeToAst('module.exports = {};');
            var expectedAst = sourceCodeToAst('$$module$$ = {};');
            transforms.renameModuleExports(ast, '$$module$$');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });
    });

    describe('replaceRequireCalls', function() {
        it('should replace require calls', function() {
            var ast = sourceCodeToAst('var foo = require("foo");');
            var expectedAst = sourceCodeToAst('var foo = $$module$$foo;');
            transforms.replaceRequireCalls(ast, '$$module$$');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });

        it('should sanitize required module names', function() {
            var ast = sourceCodeToAst('var foo = require("shared/foo");');
            var expectedAst = sourceCodeToAst('var foo = $$module$$shared_foo;');
            transforms.replaceRequireCalls(ast, '$$module$$');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });
    });

    describe('prependVariable', function() {
        it('should prepend the given variable', function() {
            var ast = sourceCodeToAst('var x;');
            var expectedAst = sourceCodeToAst('var foo; var x;');
            transforms.prependVariable(ast, 'foo');
            expect(types.astNodesAreEquivalent(ast, expectedAst)).to.be(true);
        });
    });
});
