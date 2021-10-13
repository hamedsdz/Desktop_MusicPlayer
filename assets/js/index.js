const fs = require('fs')
const path = require('path')
const glob = require('glob')
const homedir = require('os').homedir()
const $ = require('jquery')
// Objects
let ListItem = document.querySelectorAll('.list_item')
const list = document.getElementById('MusicList')
const player = document.getElementById('Player')

fs.readdirSync(homedir).forEach((folder) => {
  glob(`${homedir}/${folder}/**/*.mp3`, { silent: true }, (er, files) => {
    if (files != undefined) {
      if (files.length > 0) {
        files.forEach((file) => {
          push_to_list(file)
        })
      }
    }
  })
})

const push_to_list = (url) => {
  list.innerHTML += `
  <li class="list_item">
  <span class="row">1</span>
  <span class="link hide">${url}</span>
  <span class="album"
    ><img src="../assets/img/gramophone.svg" alt=""
  /></span>
  <span class="title">Music Name</span>
  <span class="artist">Artist Name</span>
  <span class="time">02:12</span>
  </li>`
  ListItem = document.querySelectorAll('.list_item')
  ListItem.forEach((item) =>
    item.addEventListener('click', () => {
      player.setAttribute('src', $(item).children('.hide').text())
    })
  )
}
