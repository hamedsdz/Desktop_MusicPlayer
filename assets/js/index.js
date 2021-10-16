const fs = require('fs')
// const path = require('path')
const glob = require('glob')
const getMP3Duration = require('get-mp3-duration')
const jst = require('jsmediatags')
const homedir = require('os').homedir()
const $ = require('jquery')
// Objects
let ListItem = document.querySelectorAll('.list_item')
const list = document.getElementById('MusicList')
const player = document.getElementById('Player')
// const loadingPanel = document.getElementById('loading')
const cover = document.getElementById('cover')
// Controllers
const playPause = document.getElementById('play_pause')
const mute = document.getElementById('mute')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const stop = document.getElementById('stop')
const TimeLine = document.getElementById('TimeLine')
const currentTime = document.getElementById('currentTime')
const Duration = document.getElementById('duration')
// Variables
let music_list = []
let current = 0

fs.readdirSync(homedir).forEach((folder) => {
  glob(`${homedir}/${folder}/**/*.mp3`, { silent: true }, (er, files) => {
    if (files != undefined) {
      if (files.length > 0) {
        files.forEach((file) => {
          jst.read(file, {
            onSuccess: (data) => {
              const { title, artist, picture, album, year } = data.tags
              let base64String = ''
              for (let i = 0; i < picture.data.length; i++) {
                base64String += String.fromCharCode(picture.data[i])
              }
              let imageUri =
                'data:' +
                picture.format +
                ';base64,' +
                window.btoa(base64String)
              const duration = msToTime(getMP3Duration(fs.readFileSync(file)))
              push_to_list({
                id: music_list.length + 1,
                url: file,
                title,
                artist,
                picture: imageUri,
                time: duration,
                album,
                year,
              })
            },
          })
        })
      }
    }
  })
})

const push_to_list = ({
  id,
  url,
  title,
  artist,
  picture,
  time,
  album,
  year,
}) => {
  list.innerHTML += `
  <li class="list_item" id="${id}">
  <span class="row">${id}</span>
  <span class="link hide">${url}</span>
  <span class="album"
    ><img src="${picture}" alt=""
  /></span>
  <span class="title">${title}</span>
  <span class="artist">${artist}</span>
  <span class="time">${time}</span>
  </li>`

  music_list.push({
    id,
    url,
    title,
    artist,
    picture,
    album,
    year,
    time,
  })
  ListItem = document.querySelectorAll('.list_item')
  ListItem.forEach((item) =>
    item.addEventListener('click', () => {
      current = item.id
      playSong(item.id)
    })
  )
}

const playSong = (item) => {
  player.setAttribute('src', music_list[item - 1].url)
  cover.src = music_list[item - 1].picture
  Duration.innerHTML = `${music_list[item - 1].time}`
  console.log(`${music_list[item - 1].time}`)
  ChangeActive()
  $(`#${item}`).addClass('active')
  document.querySelector('.current_music').classList.remove('pause')
  playPlayer()
}

const ChangeActive = () => {
  ListItem.forEach((item) => {
    item.classList.remove('active')
  })
}

player.onpause = () => {
  pausePlayer()
}

player.onplay = () => {
  playPlayer()
}

player.onended = () => {
  playNextMusic()
}

player.ontimeupdate = () => {
  TimeLine.max = player.duration
  TimeLine.value = player.currentTime
  currentTime.innerHTML = msToTime(player.currentTime * 1000)
}

playPause.addEventListener('click', () => {
  player.paused ? playPlayer() : pausePlayer()
})

mute.addEventListener('click', () => {
  if (player.muted) {
    player.muted = false
    mute.childNodes[1].src = '../assets/img/icons/unmute.png'
  } else {
    player.muted = true
    mute.childNodes[1].src = '../assets/img/icons/mute.png'
  }
})

prev.addEventListener('click', () => {
  playPrevMusic()
})

next.addEventListener('click', () => {
  playNextMusic()
})

stop.addEventListener('click', () => {
  player.pause()
  player.currentTime = 0
})

TimeLine.addEventListener('change', () => {
  changeTime()
})

TimeLine.addEventListener('mousedown', () => {
  changeTime()
})

const pausePlayer = () => {
  document.querySelector('.current_music').classList.add('pause')
  playPause.childNodes[1].src = '../assets/img/icons/play.png'
  player.pause()
}

const playPlayer = () => {
  document.querySelector('.current_music').classList.remove('pause')
  playPause.childNodes[1].src = '../assets/img/icons/pause.png'
  player.play()
}

const playNextMusic = () => {
  current++
  current >= music_list.length + 1 ? (current = 1) : ''
  playSong(current)
}

const playPrevMusic = () => {
  current--
  current <= 0 ? (current = music_list.length) : ''
  playSong(current)
}

const changeTime = () => {
  player.currentTime = TimeLine.value
}

function msToTime(timeInMilliseconds) {
  let h, m, s
  h = Math.floor(timeInMilliseconds / 1000 / 60 / 60)
  m = Math.floor((timeInMilliseconds / 1000 / 60 / 60 - h) * 60)
  s = Math.floor(((timeInMilliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60)
  s < 10 ? (s = `0${s}`) : (s = `${s}`)
  m < 10 ? (m = `0${m}`) : (m = `${m}`)
  h < 10 ? (h = `0${h}`) : (h = `${h}`)
  if (h !== '00') {
    return `${h}:${m}:${s}`
  }
  return `${m}:${s}`
}
