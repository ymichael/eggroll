# eggroll

Commonjs module bundler that hoists all modules into a single scope so they can
be concatenated safely without wrapping them in individual function scopes.

This allows the resulting package to be minified more efficiently and minimizes
the extra overhead at runtime from evaluating these modules. See:
https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/

## How this works

> We implement the ideas described in
> http://www.nonblocking.io/2011/12/experimental-support-for-common-js-and.html
> that have been implemented in Google's closure compiler.

1. All local variables are prefixed with a module specific prefix so they don't
   collide with local variables in other modules when added to the same scope.
2. `module.exports` and `exports.*` are replaced with a module specific global
   that other modules then reference directly.
3. `require` calls are replace with the respective module specific globals.


# Other links
- Original idea: http://www.nonblocking.io/2011/12/experimental-support-for-common-js-and.html
- Motivation: https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/
- Initial prototype: https://runkit.com/ymichael/58b1076665aeab00137caeb3
