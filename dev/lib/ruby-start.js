/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 */

import { ok as assert } from "uvu/assert";
import { codes } from "micromark-util-symbol";
import { rubyEnd } from "./ruby-end.js";

/** @type {Construct} */
export const rubyStart = {
  tokenize: tokenizeRubyStart,
  resolveAll: rubyEnd.resolveAll,
};

/** @type {Tokenizer} */
function tokenizeRubyStart(effects, ok) {
  return start;

  /** @type {State} */
  function start(code) {
    assert(code === codes.leftCurlyBrace, "expected `{`");
    effects.enter("rubyStart");
    effects.enter("rubyMarker");
    effects.consume(code);
    effects.exit("rubyMarker");
    effects.exit("rubyStart");
    return ok(code);
  }
}
