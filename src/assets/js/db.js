import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const randomstring = require('randomstring')
const moment = require('moment')

const commonChineseChar = `廠幾兒虧與萬億個勺麼廣門義屍衛飛習馬鄉豐開無專扎藝廳區歷車岡貝見氣長僕幣僅從倉風勻烏鳳為憶訂計認隊辦勸書擊撲節術厲龍滅軋東業舊帥歸葉電號叨嘆們儀叢樂處鳥務飢閃蘭匯頭漢寧討寫讓禮訓議訊記遼邊發聖對糾絲動執鞏擴掃揚場亞朴機權過協壓厭頁奪達夾軌邁畢貞師塵當嚇蟲團嗎嶼歲豈剛則網遷喬偉傳優傷價華偽會殺眾爺傘創肌雜負壯沖莊慶劉齊產決閉問闖並關湯興講軍許論農諷設訪尋迅盡導異孫陣陽階陰婦媽戲觀歡買紅纖級約紀馳壽麥進遠違運撫壇壞擾壩貢搶墳坊護殼塊聲報蒼嚴蘆勞蘇極楊兩麗醫辰勵還殲來連堅時吳縣園曠圍噸郵員聽嗚崗帳財針釘亂體伶徹余鄰腸龜猶條飯飲凍狀畝況庫療應這棄冶閒間悶灶燦沃溝懷憂窮災證啟評補識訴診詞譯靈層遲張際陸陳勁雞驅純紗納綱駁縱紛紙紋紡驢紐環責現規攏揀擔頂擁勢攔撥擇蘋莖櫃槍構傑喪畫棗賣礦碼廁奮態歐壟轟頃轉斬輪軟齒虜腎賢國暢鳴詠羅幟嶺凱敗販購圖釣偵側憑僑貨質徑貪貧膚腫脹脅魚備飾飽飼變廟劑廢淨閘鬧鄭單爐淺淚瀉潑澤憐學寶審簾實試詩誠襯視話誕詢該詳肅錄隸屆陝限駕參艱線練組細駛織終駐駝紹經貫幫掛項撓趙擋墊擠揮薦帶繭蕩榮藥標棟欄樹咸磚砌牽殘輕鴉戰點臨覽豎削嘗顯啞貴蝦蟻螞雖罵嘩響峽罰賤鈔鐘鋼鑰鉤選適種復倆貸順儉須劍膽勝脈狹獅獨獄貿饒蝕餃餅彎將獎瘡瘋親聞閥閣養類逆總煉爛潔灑澆濁測濟渾濃惱舉覺憲竊語襖誤誘說誦墾晝險嬌賀壘綁絨結繞驕繪給絡駱絕絞統豔蠶頑撈載趕鹽損撿換熱恐壺蓮獲惡檔橋礎顧轎較頓斃慮監緊黨曬曉暈喚罷圓賊賄錢鉗鑽鐵鈴鉛犧敵積稱筆筍債傾艦艙愛頌胳髒膠腦皺餓戀槳漿離資閱煩燒燭遞濤澇潤漲燙湧寬賓請諸讀襪課誰調諒談誼剝懇劇難預絹驗繼掠職蘿營夢檢聾襲輔輛虛懸嶄銅鏟銀籠償銜盤鴿領臉獵餡館癢蓋斷獸漸漁滲慚驚慘慣窯謀謊禍謎彈隱嬸頸績緒續騎繩維綿綢綠趨擱摟攪聯確暫輩輝賞噴踐遺賭賠鑄鋪鏈銷鎖鋤鍋鏽鋒銳筐築篩儲懲釋臘魯饞蠻闊糞濕灣憤竄窩褲謝謠謙屬屢緞緩編騙緣攝擺攤鵲藍獻樓賴霧輸齡鑑錯錫鑼錘錦鍵鋸矮辭籌簽簡騰觸醬糧數滿濾濫滾濱灘譽謹縫纏牆願顆蠟蠅賺鍬鍛穩籮饅賽譜騾縮囑鎮顏額聰櫻飄瞞題顛贈鏡贊籃辯懶繳辮驟鐮侖譏鄧盧嘰爾馮迂籲吆倫鳧妝汛諱訝訛訟訣馱馴紉瑪韌摳掄塢擬蕪葦杈軒鹵嘔嗆嶇佃狽鳩廬閏兌瀝淪洶滄滬詛詐墜緯坯樞楓礬毆曇嚨賬貶貯俠僥劊覓龐瘧濘寵詭屜彌參紳駒絆繹貳挾莢蕎薺葷熒棧硯鷗軸勳喲鈣鈍鈉欽鈞鈕氫朧餌巒颯閨閩婁爍炫窪誡誣誨遜隕駭摯搗聶荸萊瑩鶯棲樺樁賈礫嘮鴦贓鉀鉚秫賃聳頒臍膿鴕鴛餒齋渦渙滌澗澀憫竅諾誹諄駿瑣麩擲撣摻螢蕭薩醞碩顱晤囉嘯邏銬鐺鋁鍘銑銘矯秸穢軀斂閻闡煥鴻淵諜諧襠袱禱謁謂諺頗綽繃綜綻綴瓊攬攙蔣韓頰靂翹鑿喳晾疇鵑賦贖賜銼鋅牘憊瘓滯潰濺謗緬纜締縷騷鵡欖輻輯頻蹺錨錐鍁錠錳頹膩鵬雛饃餾稟痺謄寢褂裸謬繽贅蔫藹鹼轅轄蟬鍍簫輿譚纓攆鑷鎬簍鯉癟癱瀾譴鶴繚轍鸚籬鯨瀕韁贍鐐鱷囂鰭癩攢鬢躪鑲`

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
  const date = +new Date()
  const newRoom = {
    info: {
      createDate: date,
      name: commonChineseChar.split(``).sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0] + `之間`,
      creatorId
    },
    players: {

    },
    chat: {
      0: { content: `[created date] ${moment().format('YYYY/MM/DD HH:mm:ss')}`, date },
      1: { content: `*請勿在此發送私人敏感訊息*`, date },
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

const onRoom = (id, child, cb) => {
  if (child === `chat`)
    roomRef.child(`${id}/${child}`).orderByChild('date').limitToLast(10).on('value', (snap) => {
      cb(snap.val())
      console.log(`[event]${id}/${child}`)
    })
  else
    roomRef.child(`${id}/${child}`).on('value', (snap) => {
      cb(snap.val())
      console.log(`[event]${id}/${child}`)
    })
}

const setRoomInfo = async (id, info = {}) => {
  await roomRef.child(`${id}/info`).update(info)
  return true
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
  sendChat,
}
