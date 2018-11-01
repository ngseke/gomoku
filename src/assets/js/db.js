import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const randomstring = require('randomstring')
const moment = require('moment')

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
const playerRef = firebase.database().ref('players')
const roomRef = firebase.database().ref('rooms')
const connectedRef = firebase.database().ref('.info/connected')

// 以 id 查詢玩家資訊
const getPlayer = (id) => {
  return new Promise((resolve, reject) => {
    playerRef.child(id).once('value')
      .then(snap => resolve(snap.val()))
      .catch(e => reject(e))
  })
}

// 新增或編輯玩家
const setPlayer = (id, name, isNew = true) => {
  const newPlayer = {
    name,
  }
  if (isNew) newPlayer.createDate = +new Date()

  const { detect } = require('detect-browser')
  const browser = detect()
  if (browser) newPlayer.browser = browser

  return new Promise((resolve, reject) => {
    playerRef.child(id).update(newPlayer)
      .then(result => resolve())
      .catch(e => reject(e))
  })
}

// 新增房間
const createRoom = (creatorId = null) => {
  const newRoom = {
    info: {
      createDate: +new Date(),
      name: `A Room`,
      creatorId
    },
    players: {

    },
    chat: {
      0: {
        content: `The room has created on ${moment().format('YYYY/MM/DD HH:mm:ss')}`,
        date: +new Date(),
      }
    },
    game: {
      board: [1],
      previous: {
        chess: 1,
        position: { x: 10, y: 100}
      },
      result: {}
    },
  }
  const idLength = [3, 4].sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0] // id 長度隨機為 3 或 4
  let id = null
  let createAttemptCounter = 50   // 檢查 room id 嘗試次數

  return new Promise((resolve, reject) => {
    (async () => {
      while (createAttemptCounter-- >= 0) {
        id = randomstring.generate({ length: idLength, charset: `alphanumeric`, capitalization: `uppercase` })
        console.log(`Room created. id: ${id}`)
        if (!(await getIsRoomExist(id))) break
      }
      if(createAttemptCounter >= 0) {
        roomRef.child(id).set(newRoom)
          .then(() => resolve(id))
          .catch(e => reject(e))
      } else {
        reject(`out of roomId`)
      }
    })()
  })
}

// 取得房間是否存在
const getIsRoomExist = (id) => {
  return new Promise((resolve, reject) => {
    roomRef.child(id).once('value')
      .then(snap => resolve(snap.exists()))
      .catch(e => reject(e))
  })
}

const onRoom = (id, child, cb) => {
  if (child === `chat`)
    roomRef.child(`${id}/${child}`).limitToLast(10).on('value', (snap) => {
      cb(snap.val())
      console.log(`[event]${id}/${child}`)
    })
  else
    roomRef.child(`${id}/${child}`).on('value', (snap) => cb(snap.val()))
}

const offRoom = (id, child) => {
  roomRef.child(id).child(child).off()
}

const joinRoom = async (id, fingerprint) => {
  const player = await getPlayer(fingerprint)
  const joinedPlayer = {
    date: +new Date(),
    info: player,
  }
  await roomRef.child(`${id}/players/${fingerprint}`).set(joinedPlayer)
  return true
}

const leaveRoom = (id, fingerprint) => {
  return new Promise((resolve, reject) => {
    roomRef.child(`${id}/players/${fingerprint}`).remove()
      .then(() => resolve())
      .catch(e => reject(e))
  })
}

const sendChat = async (id, content, fingerprint = null) => {
  const player = (fingerprint) ? await getPlayer(fingerprint) : null
  const message = {
    date: +new Date(),
    player,
    content,
  }
  await roomRef.child(`${id}/chat`).push(message)
}

export default {
  dbRef,
  playerRef,
  roomRef,
  connectedRef,
  //
  getPlayer,
  setPlayer,
  //
  createRoom,
  getIsRoomExist,
  onRoom,
  offRoom,
  joinRoom,
  leaveRoom,
  //
  sendChat
}
