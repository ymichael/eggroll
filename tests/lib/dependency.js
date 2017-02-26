var path = require('path');
var expect = require('expect.js');
var dependencies = require('../../lib/dependency');

var stubRoot = path.normalize(path.join(__dirname, '../../stubs'));

describe('dependencies', function() {
    describe('getRequiredModules', function() {
        it('should return required modules', function() {
            var sourceCode = 'require("foo"); require("bar")';
            var expected = ['foo', 'bar'];
            expect(dependencies.getRequiredModules(sourceCode)).to.eql(expected);
        });

        it('should return required modules in order', function() {
            var sourceCode = 'require("foo"); require("bar"); require("foo");';
            var expected = ['foo', 'bar'];
            expect(dependencies.getRequiredModules(sourceCode)).to.eql(expected);
        });
    });

    describe('bundleDependencies', function() {

        it('should return the list of bundle dependencies', function() {
            var expected;

            expected = ['bar2'];
            expect(dependencies.bundleDependencies('bar2', stubRoot)).to.eql(expected);

            expected = ['bar2', 'foo2'];
            expect(dependencies.bundleDependencies('foo2', stubRoot)).to.eql(expected);

            expected = ['bar2', 'foo2', 'baz'];
            expect(dependencies.bundleDependencies('baz', stubRoot)).to.eql(expected);

            expected = ['bar2', 'foo2', 'baz', 'foo', 'bar'];
            expect(dependencies.bundleDependencies('bar', stubRoot)).to.eql(expected);

            expected = ['bar2', 'foo2', 'baz', 'bar', 'foo', 'entry'];
            expect(dependencies.bundleDependencies('entry', stubRoot)).to.eql(expected);
        });
    });
});
