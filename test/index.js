import { micromark } from "micromark";
import { jaruby as syntax, jarubyHtml as html } from "../dev/index.js";
import test from "tape";

test("md -> html", (t) => {
  t.equal(
    micromark(
      "{聖剣}^(エクスカリバー)は、{アーサー王}^(King Arthur)の剣である。",
      {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }
    ),
    "<p><ruby>聖剣<rp>(</rp><rt>エクスカリバー</rt><rp>)</rp></ruby>は、<ruby>アーサー王<rp>(</rp><rt>King Arthur</rt><rp>)</rp></ruby>の剣である。</p>",
    "basic conversion check"
  );
  t.equal(
    micromark("{聖剣}^((エクスカリバー))", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p>{聖剣}^((エクスカリバー))</p>",
    "should not support parenthesis in ruby pronunciation"
  );
  t.equal(
    micromark("{聖剣}}", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p>{聖剣}}</p>",
    "should not support parenthesis in ruby pronunciation"
  );
  t.equal(
    micromark("{聖剣}^(\\{エクス\\}\\^\\(ex\\)カリバー)", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p><ruby>聖剣<rp>(</rp><rt>{エクス}^(ex)カリバー</rt><rp>)</rp></ruby></p>",
    "should support escape"
  );
  t.equal(
    micromark("{**聖剣**}^(エクスカリバー)は、アーサー王の剣である。", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p><ruby><strong>聖剣</strong><rp>(</rp><rt>エクスカリバー</rt><rp>)</rp></ruby>は、アーサー王の剣である。</p>",
    "should support rubied text decoration"
  );
  t.equal(
    micromark("{聖剣}^(**エクスカリバー**)は、アーサー王の剣である。", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p><ruby>聖剣<rp>(</rp><rt>**エクスカリバー**</rt><rp>)</rp></ruby>は、アーサー王の剣である。</p>",
    "should not support ruby pronunciation text decoration"
  );
  t.equal(
    micromark("{{聖剣}^(holy sword)}^({エクスカリバー}^(excalibur))", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p>{<ruby>聖剣<rp>(</rp><rt>holy sword</rt><rp>)</rp></ruby>}^(<ruby>エクスカリバー<rp>(</rp><rt>excalibur</rt><rp>)</rp></ruby>)</p>",
    "should not support multi-level ruby: only the most inner one is converted"
  );
  t.equal(
    micromark("{2}^{10}は、1024である。", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p>{2}^{10}は、1024である。</p>",
    "should not interfere with exponentation expression"
  );

  t.equal(
    micromark(
      "$$ ( sum_{k=1}^{n} a_k b_k )^2 leq ( sum_{k=1}^{n} {a_k}^2 ) ( sum_{k=1}^{n} {b_k}^2 ) $$",
      {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }
    ),
    "<p>$$ ( sum_{k=1}^{n} a_k b_k )^2 leq ( sum_{k=1}^{n} {a_k}^2 ) ( sum_{k=1}^{n} {b_k}^2 ) $$</p>",
    "should not interfere with math expression"
  );
  t.equal(
    micromark("```\n{聖剣}^(エクスカリバー)\n```", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<pre><code>{聖剣}^(エクスカリバー)\n</code></pre>",
    "should not interfere with code block"
  );
  t.equal(
    micromark("{聖剣\n}^(エクスカリバー\n)", {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }),
    "<p><ruby>聖剣\n<rp>(</rp><rt>エクスカリバー\n</rt><rp>)</rp></ruby></p>",
    "should support newline"
  );
  t.end();
});
