var expect = require('expect.js');
var utils = require('../../lib/utils');

describe('utils', function() {
    describe('sanitizeVariableName', function() {
        it('should sanitize unsafe characters', function() {
            var actual = utils.sanitizeVariableName('./shared/foo-bar');
            var expected = '__shared_foo_bar';
            expect(actual).to.be(expected);
        });
    });

    describe('getModuleId', function() {
        it('should return the correct module id', function() {
            var actual = utils.getModuleId('pub/foo.js', 'pub/');
            var expected = 'foo';
            expect(actual).to.be(expected);

            actual = utils.getModuleId('pub/shared/foo.js', 'pub/');
            expected = 'shared/foo';
            expect(actual).to.be(expected);
        });
    });

    describe('getModulePath', function() {
        it('should return the correct module path', function() {
            var actual = utils.getModulePath('foo', 'pub/');
            var expected = 'pub/foo.js';
            expect(actual).to.be(expected);

            actual = utils.getModulePath('./foo', 'pub/');
            expected = 'pub/foo.js';
            expect(actual).to.be(expected);

            actual = utils.getModulePath('shared/foo', 'pub/');
            expected = 'pub/shared/foo.js';
            expect(actual).to.be(expected);
        });
    });

    describe('normalizeModuleId', function() {
        it('should just return absolute module ids', function() {
            var actual = utils.normalizeModuleId('foo', 'bar');
            var expected = 'foo';

            actual = utils.normalizeModuleId('shared/foo', 'bar');
            expected = 'shared/foo';
        });

        it('should handle ./', function() {
            var actual = utils.normalizeModuleId('./foo', 'bar');
            var expected = 'foo';

            actual = utils.normalizeModuleId('./foo', 'shared/bar');
            expected = 'shared/foo';
        });

        it('should handle ../', function() {
            var actual = utils.normalizeModuleId('../foo', 'shared/bar');
            var expected = 'foo';

            actual = utils.normalizeModuleId('../foo', 'shared/core/bar');
            expected = 'shared/foo';
        });
    });
});
