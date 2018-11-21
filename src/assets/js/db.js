import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
const randomstring = require('randomstring')
const moment = require('moment')

import chessBoard from './chessBoard'
import chineseChar from './chineseChar'

const commonChineseChar = chineseChar.commonChineseChar

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
  const newPlayer = { name }
  if (isNew) {
    newPlayer.createDate = +new Date()
    newPlayer.record = { win: 0, lose: 0, even: 0}
  }

  const { detect } = require('detect-browser')
  const browser = detect()
  if (browser) newPlayer.browser = browser

  return new Promise((resolve, reject) => {
    playerRef.child(id).update(newPlayer)
      .then(result => resolve())
      .catch(e => reject(e))
  })
}

// 設定玩家戰績
const setPlayerRecord = async (idA, idB, isEven = false) => {
  if (!isEven) {
    if (idA && await getPlayer(idA)) {
      const playerAWin = (await playerRef.child(`${idA}/record/win`).once('value')).val()
      await playerRef.child(`${idA}/record/win`).set(playerAWin + 1)
    }
    if (idB && await getPlayer(idB)) {
      const playerBLose = (await playerRef.child(`${idB}/record/lose`).once('value')).val()
      await playerRef.child(`${idB}/record/lose`).set(playerBLose + 1)
    }
  } else {

  }
}

// 新增房間
const createRoom = (creatorId = null) => {
  const date = +new Date()
  const board = chessBoard.getNewBoard(15)

  const newRoom = {
    info: {
      createDate: date,
      name: commonChineseChar.split(``).sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0] + `之間`,
      creatorId
    },
    players: {},
    chat: {
      // 0: { content: `[Created Date] ${moment().format('YYYY/MM/DD HH:mm:ss')}`, date },
    },
    game: {
      board,
      previous: {
        chess: 0,
        position: { x: 10, y: 100}
      },
      result: {}
    },
  }

  const idLength = [3].sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0] // id 長度隨機為 3 或 4
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
          .then(() => {
            sendChat(id, `[Room ID] ${id}`)
            resolve(id)
          })
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

const getIsLoggedIn = (id, fingerprint) => {
  return new Promise((resolve, reject) => {
    roomRef.child(`${id}/players/${fingerprint}`).once('value')
      .then(snap => resolve(snap.exists()))
      .catch(e => reject(e))
  })
}

const onRoom = (id, child, cb) => {
  if (child === `chat`) {
    roomRef.child(`${id}/${child}`).orderByChild('date').limitToLast(20).on('value', (snap) => {
      cb(snap.val())
    })
  }
  else {
    roomRef.child(`${id}/${child}`).on('value', (snap) => {
      cb(snap.val())
    })
  }
}

const setRoomInfo = async (id, info = {}) => {
  await roomRef.child(`${id}/info`).update(info)
  return true
}

const offRoom = (id, child) => {
  roomRef.child(id).child(child).off()
}

const getRoomPlayer = async (id) => {
  const snap = await roomRef.child(`${id}/players/`).once('value')
  const players = snap.val()
  return players
}

const getRoomPlayerCount = async (id) => {
  const snap = await roomRef.child(`${id}/players/`).once('value')
  const players = snap.val()
  if (players === null) return 0
  return Object.keys(players).length
}

const joinRoom = async (id, fingerprint, chess = 0) => {
  const player = await getPlayer(fingerprint)
  const joinedPlayer = {
    date: +new Date(),
    info: player,
    chess
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

const sendGame = async (id, game) => {
  await roomRef.child(`${id}/game`).set(game)
}

const sendChat = async (id, content, fingerprint = null) => {
  const player = (fingerprint) ? await getPlayer(fingerprint) : null
  if (fingerprint) player.fingerprint = fingerprint
  const message = {
    date: firebase.database.ServerValue.TIMESTAMP,
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
  getIsLoggedIn,
  setPlayerRecord,
  //
  createRoom,
  getIsRoomExist,
  getRoomPlayer,
  getRoomPlayerCount,
  onRoom,
  offRoom,
  joinRoom,
  leaveRoom,
  setRoomInfo,
  //
  sendGame,
  //
  sendChat,
  //
}
