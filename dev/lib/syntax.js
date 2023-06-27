/**
 * @typedef {import("micromark-util-types").Extension} Extension
 */

import { codes } from "micromark-util-symbol";
import { rubyStart } from "./ruby-start.js";
import { rubyEnd } from "./ruby-end.js";

/**
 * @returns {Extension}
 */
export function jaruby() {
  return {
    text: {
      [codes.leftCurlyBrace]: rubyStart,
      [codes.rightCurlyBrace]: rubyEnd,
    },
    insideSpan: { null: [rubyStart] },
  };
}
