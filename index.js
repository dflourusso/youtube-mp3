const YouTube = require('youtube-node')
const shell = require('shelljs')
const videos = require('./videos')
const API_KEY = '<your-api-key>'

const youTube = new YouTube()

youTube.setKey(API_KEY)

function getVideoId(searchTerm) {
  return new Promise((resolve, reject) => {
    youTube.search(searchTerm, 1, function (error, result) {
      if (error) {
        reject(error)
      }
      else {
        const id = result.items[0].id.videoId
        resolve(id)
      }
    })    
  })
}

function buildUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`
}

function download(url) {
  console.log('Downloading:', url)
  const response = shell.exec(`cd downloads && youtube-dl --extract-audio --audio-format mp3 '${url}'`)
  if (response.code !== 0) {
    shell.echo('Download error')
  }
}

async function run() {
  shell.exec('mkdir downloads')
  for (const video of videos) {
   await download(buildUrl(await getVideoId(video)))
  }
}

run()