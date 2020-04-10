const fetch = require("node-fetch");
const cheerio = require("cheerio");

/**
 *
 * @param {string} s
 * @returns {string}
 */
function format(s) {
  return s.replace(/ /g, "-").replace(/'/g, "");
}

/**
 *
 * @param {string} artist
 * @param {string} songTitle
 */
async function fetchPageData(artist, songTitle) {
  const res = await fetch(
    `https://genius.com/${format(artist)}-${format(songTitle)}-lyrics`
  );

  const html = await res.text();
  const $ = cheerio.load(html);
  const blocLyrics = $("div.lyrics");

  return blocLyrics.children().text();
}

!(async function main(args) {
  const artist = args[2] || "watsky";
  const song = args[3] || "whoa whoa whoa";
  console.log(await fetchPageData(artist, song));
})(process.argv);
