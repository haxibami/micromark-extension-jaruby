import { micromark } from "micromark";
import { jaruby as syntax, jarubyHtml as html } from "../dev/index.js";

const markdown = `
{聖剣}^(エクスカリバー)
`;
console.log(
  micromark(markdown, {
    extensions: [syntax()],
    htmlExtensions: [html()],
  }),
);
