# micromark-extension-jaruby

[![Node.js CI](https://github.com/haxibami/micromark-extension-jaruby/actions/workflows/node.js.yml/badge.svg)](https://github.com/haxibami/micromark-extension-jaruby/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/haxibami/micromark-extension-jaruby/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/haxibami/micromark-extension-jaruby/actions/workflows/npm-publish.yml)
[![codecov](https://codecov.io/gh/haxibami/micromark-extension-jaruby/branch/main/graph/badge.svg?token=T1MNL1L1O7)](https://codecov.io/gh/haxibami/micromark-extension-jaruby)
[![GitHub license](https://img.shields.io/github/license/haxibami/micromark-extension-jaruby)](https://github.com/haxibami/micromark-extension-jaruby/blob/main/LICENSE)

[micromark](https://github.com/micromark/micromark) extension to support Japanese ruby.

## Feature

- compatible with remark / rehype / unified, using [remark-jaruby](https://github.com/haxibami/remark-jaruby) or [mdast-util-jaruby](https://github.com/haxibami/mdast-util-jaruby)
- fully typed

## Install

Node.js

```sh
npm install micromark-extension-jaruby
```

## Usage

```js
import { micromark } from "micromark";
import {
  jaruby as syntax,
  jarubyHtml as html,
} from "micromark-extension-jaruby";

const markdown = `
{聖剣}^(エクスカリバー)
`;

console.log(
  micromark(markdown, {
    extensions: [syntax()],
    htmlExtensions: [html()],
  }),
);
```

generates...

```html
<p>
  <ruby>聖剣<rp>(</rp><rt>エクスカリバー</rt><rp>)</rp></ruby>
</p>
```

## Note

- This package is almost a refactoring of [remark-ruby](https://github.com/laysent/remark-ruby). Original package is licensed under [MIT License](https://github.com/laysent/remark-ruby/blob/a5d2ec31cf4750e003890204ea43a71607d5e4d8/LICENSE).
- Support for text delimitation & `<rb>` tag in original package was omitted, since only few browsers can display it.
