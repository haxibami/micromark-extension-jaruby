/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/** @returns {HtmlExtension} */
export function jarubyHtml() {
  return {
    enter: {
      ruby() {
        this.tag("<ruby>");
      },
      rubyPronunciation() {
        this.tag("<rp>(</rp><rt>");
      },
    },
    exit: {
      ruby() {
        this.tag("</ruby>");
      },
      rubyPronunciation() {
        this.tag("</rt><rp>)</rp>");
      },
    },
  };
}
