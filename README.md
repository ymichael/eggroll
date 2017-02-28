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

Running eggroll on the
[rollup-comparison](https://github.com/nolanlawson/rollup-comparison): with output:
https://gist.github.com/ymichael/91ef54ca7c756530635285cf8eb41d6e (318 bytes gzipped).

## Installation

```
npm install -g eggroll

## Quick Start

```sh
# Outputs a bundle using main.js as the entry point.
$ eggroll bundle --resolve main.js

# Outputs a bundle using public/main.js as the entry point.
$ eggroll bundle --resolve --root ./public ./public/main.js

# Outputs a bundle containing the given files
$ eggroll bundle --resolve --root ./public ./public/foo.js ./public/bar.js
```

## Usage

```sh
Usage: eggroll <command> [options]

Commands:
  deps [options]               Output the dependencies found for the given entry
                               point
  bundle [options] <files...>  Bundle the given files

Options:
  -h, --help  Show help                                                [boolean]
```

```sh
$ eggroll bundle -h
bin/cli.js bundle [options] <files...>

Options:
  -h, --help  Show help                                                [boolean]
  --prefix    custom prefix for module variables[string] [default: "$$module$$"]
  --resolve   whether to resolve dependencies         [boolean] [default: false]
  --root      root to resolve module ids
                                             [string] [default: "process.cwd()"]
```

```sh
$ eggroll deps [options]

Options:
  -h, --help  Show help                                                [boolean]
  --entry     module id of bundle entry point                [string] [required]
  --root      root to resolve module ids
                                             [string] [default: "process.cwd()"]
```

## API Example

```js
var eggroll = require('eggroll');
// TODO

```

## Other links
- Original idea: http://www.nonblocking.io/2011/12/experimental-support-for-common-js-and.html
- Motivation: https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/
- Initial prototype: https://runkit.com/ymichael/58b1076665aeab00137caeb3
- https://en.wikipedia.org/wiki/Egg\_roll
