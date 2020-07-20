// This version scrapes syair.info website.
// This website offers LRC file of multiple musics.

import fetch from 'node-fetch'

/*
 * @param {string} artist
 * @param {string} song
 */
async function fetchLyrics(artist, song) {
	const name = `${artist} - ${song}`
	const sanitizedName = name.replace(/\//g, '_').replace(/ /g, '+').replace(/&/g, '%26')
	
	const searchResult = await (await fetch(`https://syair.info/search?q=${sanitizedName}`)).text()
	const firstResult = searchResult.match(new RegExp('<div class="li">1\. <a href="/lyrics/([^"]+)" target="_blank" class="title">'))
	if (!firstResult) return null
	
	const lyricsPage = await (await fetch(`https://syair.info/lyrics/${firstResult[1]}`)).text()

	const downloadLink = lyricsPage.match(new RegExp('<a href="/download\.php\?([^"]+)" rel="nofollow" target="_blank"><span>Download '))
	if (!downloadLink) return null 
	const lyrics = await (await fetch(`https://syair.info/download.php${downloadLink[1]}`)).text()
	return lyrics
}


async function main() {
	const args = process.argv
	const artist = args[2] || 'romeo elvis'
	const song = args[3] || 'malade'
	console.log(await fetchLyrics(artist, song))
}


main()
