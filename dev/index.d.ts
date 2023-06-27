export { jarubyHtml } from "./lib/html.js";
export { jaruby } from "./lib/syntax.js";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    ruby: "ruby";
    rubyPronunciation: "rubyPronunciation";
    rubyPronunciationMarker: "rubyPronunciationMarker";
    rubyStart: "rubyStart";
    rubyText: "rubyText";
    rubyEnd: "rubyEnd";
    rubyLabel: "rubyLabel";
    rubyMarker: "rubyMarker";
  }
}
