import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const randomstring = require('randomstring')


const config = {
  apiKey: 'AIzaSyD6tU4SaDPQ8Eat9H3EXF24Y4WMguWFs5w',
  authDomain: 'xiaqi-game.firebaseapp.com',
  databaseURL: 'https://xiaqi-game.firebaseio.com',
  projectId: 'xiaqi-game',
  storageBucket: 'xiaqi-game.appspot.com',
  messagingSenderId: '654416224229'
}

firebase.initializeApp(config)
const dbRef = firebase.database().ref()
const dbPlayers = firebase.database().ref('players')
const dbRooms = firebase.database().ref('rooms')

const getPlayer = (id) => {
  return new Promise((resolve, reject) => {
    dbPlayers.child(id).once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(e => reject(e))
  })
}

const setPlayer = (id, name, isNew = true) => {
  const newPlayer = {
    name,
  }
  if (isNew) newPlayer.createDate = +new Date()

  const { detect } = require('detect-browser')
  const browser = detect()
  if (browser) newPlayer.browser = browser

  return new Promise((resolve, reject) => {
    dbPlayers.child(id).update(newPlayer)
      .then(result => resolve())
      .catch(e => reject(e))
  })
}

const createRoom = () => {
  const id = randomstring.generate({ length: 4, charset: `alphanumeric`, capitalization: `lowercase` })
  const newRoom = {}

  return new Promise((resolve, reject) => {
    dbRooms.child(id).set(newRoom)
      .then(result => resolve(id))
      .catch(e => reject(e))
  })
}

const checkRoomIdDuplicate = () => {
  return new Promise((resolve, reject) => {
    dbRooms.child(id).once().then(snapshot => snapshot.val())
  })
}


export default {
  dbRef,
  getPlayer,
  setPlayer,
  createRoom,
}
