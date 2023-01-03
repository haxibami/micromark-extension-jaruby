/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').State} State
 */

import { ok as assert } from "uvu/assert";
import { push, splice } from "micromark-util-chunked";
import { normalizeIdentifier } from "micromark-util-normalize-identifier";
import { resolveAll } from "micromark-util-resolve-all";
import { codes } from "micromark-util-symbol/codes.js";
import { types } from "micromark-util-symbol/types.js";
import { markdownLineEnding } from "micromark-util-character";
import { markdownSpace } from "micromark-util-character";

/** @type {Construct} */
export const rubyEnd = {
  tokenize: tokenizeRubyEnd,
  resolveTo: resolveToRubyEnd,
  resolveAll: resolveAllRubyEnd,
};

/** @type {Construct} */
const pronunciationConstruct = {
  tokenize: tokenizePronunciation,
};

/** @type {Resolver} */
function resolveAllRubyEnd(events) {
  let index = -1;
  /** @type {Token} */
  let token;

  while (++index < events.length) {
    token = events[index][1];

    if (token.type === "rubyStart" || token.type === "rubyEnd") {
      // Remove the marker.
      events.splice(index + 1, 2);
      token.type = types.data;
      index++;
    }
  }

  return events;
}

/** @type {Resolver} */
function resolveToRubyEnd(events, context) {
  let index = events.length;
  /** @type {Token} */
  let token;
  /** @type {number|undefined} */
  let open;
  /** @type {number|undefined} */
  let close;
  /** @type {Event[]} */
  let media;

  // Find an opening.
  while (index--) {
    token = events[index][1];

    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === "ruby" ||
        (token.type === "rubyStart" && token._inactive)
      ) {
        break;
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === "enter" && token.type === "rubyStart") {
        token._inactive = true;
      }
    } else if (close) {
      if (
        events[index][0] === "enter" &&
        token.type === "rubyStart" &&
        !token._balanced
      ) {
        open = index;
      }
    } else if (token.type === "rubyEnd") {
      close = index;
    }
  }

  assert(open !== undefined, "`open` is supposed to be found");
  assert(close !== undefined, "`close` is supposed to be found");

  const group = {
    type: "ruby",
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end),
  };

  const label = {
    type: "rubyLabel",
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end),
  };

  const text = {
    type: "rubyText",
    start: Object.assign({}, events[open + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start),
  };

  media = [
    ["enter", group, context],
    ["enter", label, context],
  ];

  // Opening marker.
  media = push(media, events.slice(open + 1, open + 3));

  // Text open.
  media = push(media, [["enter", text, context]]);

  // Between.
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + 4, close - 3),
      context
    )
  );

  // Text close, marker close, label close.
  media = push(media, [
    ["exit", text, context],
    events[close - 2],
    events[close - 1],
    ["exit", label, context],
  ]);

  // Reference, resource, or so.
  media = push(media, events.slice(close + 1));

  // Media close.
  media = push(media, [["exit", group, context]]);

  splice(events, open, events.length, media);

  return events;
}

/**
 * @this {TokenizeContext}
 * @param {Effects} effects
 * @param {State} ok
 * @param {State} nok
 */
function tokenizeRubyEnd(effects, ok, nok) {
  const self = this;
  let index = self.events.length;
  /** @type {Token} */
  let rubyStart;
  /** @type {boolean} */
  let defined;

  // Find an opening.
  while (index--) {
    if (
      self.events[index][1].type === "rubyStart" &&
      !self.events[index][1]._balanced
    ) {
      rubyStart = self.events[index][1];
      break;
    }
  }

  return start;

  /** @type {State} */
  function start(code) {
    assert(code === codes.rightCurlyBrace, "expected `}`");

    if (!rubyStart) {
      return nok(code);
    }

    // It’sa balanced bracket, but contains a link.
    if (rubyStart._inactive) return balanced(code);
    defined =
      self.parser.defined.indexOf(
        normalizeIdentifier(
          self.sliceSerialize({ start: rubyStart.end, end: self.now() })
        )
      ) > -1;
    effects.enter("rubyEnd");
    effects.enter("rubyMarker");
    effects.consume(code);
    effects.exit("rubyMarker");
    effects.exit("rubyEnd");
    return rubyCaret;
  }

  /** @type {State} */
  function rubyCaret(code) {
    if (code !== codes.caret) {
      return nok(code);
    }

    effects.consume(code);
    return afterRubyEnd;
  }

  /** @type {State} */
  function afterRubyEnd(code) {
    // Ruby: `{asd}^(fgh)`.
    if (code === codes.leftParenthesis) {
      return effects.attempt(
        pronunciationConstruct,
        ok,
        defined ? ok : balanced
      )(code);
    }

    return defined ? ok(code) : balanced(code);
  }

  /** @type {State} */
  function balanced(code) {
    rubyStart._balanced = true;
    return nok(code);
  }
}

/** @type {Tokenizer} */
function tokenizePronunciation(effects, ok, nok) {
  let size = 0;
  /** @type {boolean} */
  let data;

  return start;

  /** @type {State} */
  function start(code) {
    assert(code === codes.leftParenthesis, "expected left paren");
    effects.enter("rubyPronunciation");
    effects.enter("rubyPronunciationMarker");
    effects.consume(code);
    effects.exit("rubyPronunciationMarker");
    return open;
  }

  /** @type {State} */
  function open(code) {
    if (code === codes.rightParenthesis || code === codes.leftParenthesis) {
      return end(code);
    }

    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return open;
    }

    effects.enter("chunkString", { contentType: "string" });
    return pronunciation(code);
  }

  /** @type {State} */
  function pronunciation(code) {
    if (
      code === codes.eof ||
      code === codes.leftParenthesis ||
      code === codes.rightParenthesis ||
      markdownLineEnding(code) ||
      size++ > 999
    ) {
      effects.exit("chunkString");
      return open(code);
    }

    effects.consume(code);
    data = data || !markdownSpace(code);
    return code === codes.backslash ? pronunciationEscape : pronunciation;
  }

  /** @type {State} */
  function pronunciationEscape(code) {
    if (
      code === codes.leftParenthesis ||
      code === codes.backslash ||
      code === codes.rightParenthesis
    ) {
      effects.consume(code);
      size++;
      return pronunciation;
    }

    return pronunciation(code);
  }

  /** @type {State} */
  function end(code) {
    if (code === codes.rightParenthesis) {
      effects.enter("rubyPronunciationMarker");
      effects.consume(code);
      effects.exit("rubyPronunciationMarker");
      effects.exit("rubyPronunciation");
      return ok;
    }

    return nok(code);
  }
}
