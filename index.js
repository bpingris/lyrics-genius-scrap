const fetch = require("node-fetch");
const cheerio = require("cheerio");

/**
 *
 * @param {string} s
 * @returns {string}
 */
function fformat(s) {
  return s.replace(/ /g, "-").replace(/'|,|"/g, "");
}

function format(artist, song) {
	const ft = new RegExp(/([(\[](feat|ft)[^)\]]*[)\]]|- .*)/, 'i');
	const wth = /with(.*)/;
	const spc = / *- *| +/g;
	const nlt = new RegExp(/[^\x00-\x7F\x80-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/g);

	song = song.replace(ft, '');
	const w = wth.exec(song);
	if (w) {
		song = song.replace(w[0], '');
		const a = w[1];
		if (a.includes('&')) {
			artist += `-${a}`;
		} else {
			artist += `-and-${a}`;
		}
	}
	let fullsong = `${artist}-${song}`;
	fullsong = fullsong.replace(/&/g, 'and');
	fullsong = fullsong.replace(/\/|!|_/g, ' ');
	const weird = ['Ø', 'ø', "'"];
	weird.forEach(c => {
		if (fullsong.includes(c)) {
			fullsong = fullsong.replace(c, '');
		}
	});
	fullsong = fullsong.replace(nlt, '');
	fullsong = fullsong.trim().replace(spc, '-');
	return fullsong;
}


/**
 *
 * @param {string} artist
 * @param {string} songTitle
 */
async function fetchLyrics(artist, songTitle) {
  const url = format(artist, songTitle)
  const res = await fetch(
    `https://genius.com/${url}-lyrics`
  );
  const html = await res.text();
  const $ = cheerio.load(html);
  const blocLyrics = $("div.lyrics");

  return blocLyrics.children().text();
}

!(async function main(args) {
  const artist = args[2] || "watsky";
  const song = args[3] || "whoa whoa whoa";
  console.log(await fetchLyrics(artist, song));
})(process.argv);
