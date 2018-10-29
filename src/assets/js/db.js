import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

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

const getPlayer = (id) => {
  return new Promise((resolve, reject) => {
    dbPlayers.child(id).once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(e => reject(e))
  })
}

const setNewPlayer = (id, name) => {
  const newPlayer = {
    name,
    createDate: +new Date()
  }
  return new Promise((resolve, reject) => {
    dbPlayers.child(id).set(newPlayer)
      .then(result => resolve())
      .catch(e => reject(e))
  })
}

export default {
  dbRef,
  getPlayer,
  setNewPlayer
}
