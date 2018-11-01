<template lang="pug">
main
  Logo(:name='roomName' @clickRoomName='clickChangeRoomName()')
  .container(v-if='!isLoading')
    .row(v-show='page === `game`')
      .col-12.col-md-5.col-lg-4
        #player-list
          ul
            li(v-for='p in players' :title='`加入遊戲時間: ${convertDate(p.date)}`') #[fa(icon='user')]  {{ p.info.name }}
        Chat(:roomId='roomId' :fingerprint='fingerprint' ref='chat')
      .col-12.col-md
    .row.justify-content-center.align-items-center.mt-3(v-if='page === `name`')
      .col-12.col-md-6.col-lg-5.col-xl-4(v-if='fingerprint')
        Nickname(v-model.trim='newRoomName' @confirm='confirmRoomName' @cancel='page = `game`' :isRoomName='true' )
  .loader(v-if='isLoading')
    span.icon #[fa(icon='circle-notch' spin)]
    span {{ status[(status.length - 1)] }}
</template>

<script>
import Logo from '@/components/Logo.vue'
import Chat from '@/components/Chat.vue'
import Nickname from '@/components/Nickname.vue'
import { common } from '@/mixins/common'
import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'
import room from '@/assets/js/room'
import firebase from 'firebase/app'
import moment from 'moment'
import randomstring from 'randomstring'


export default {
  name: 'Room',
  data () {
    return {
      linstenList: [`info`, `players`, `game`],
      info: null,
      players: null,
      game: null,
      roomId: null,
      session: null,
      page: `game`,
      newRoomName: ``,
    }
  },
  created () {
    this.roomId = this.$route.params.id   // 根據網址參數設定 roomId
    this.session = randomstring.generate({ length: 6 })
  },
  mounted () {
    this.status.push(`初始化...`)
    this.init()
  },
  methods: {
    // 初始化
    async init () {
      this.isLoading = true   // 設定正在載入中

      await this.setProfile() // 取得玩家本人資料
      await this.checkRepeatLogin() // 檢查是否重複登入
      await this.checkRoom()  // 檢查房間是否存在
      await this.joinRoom()   // 加入房間

      this.status.push(`監聽房間`)

      // 監聽房間內 linstenList 列表中所有子節點
      this.linstenList.forEach(child => {
        db.onRoom(this.roomId, child, (data) => this[child] = data)
      })

      // 當 `本機` 離線時呼叫 disconnect()
      db.connectedRef.on('value', (snap) => {
        if (snap.val() !== true) this.disconnect()
      })

      // 當 `遠端` 偵測本機離線時
      // 1. 移除 players 中的玩家本人
      db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().remove()
      // 2. 聊天室插入離開訊息
      db.roomRef.child(`${this.roomId}/chat/${this.session}`).onDisconnect().set({
        date:  firebase.database.ServerValue.TIMESTAMP,
        content: `${this.profile.name} has accidentally left.`
      })

      this.isLoading = false

      this.$nextTick(() => {
        this.$nextTick(() => this.sendSystemInfo(`${this.profile.name} has joined.`))
      })
    },
    async disconnect () {
      this.goToIndex()
    },
    async setProfile () {
      this.status.push(`取得裝置指紋`)
      this.fingerprint = await fingerprint.get()
      this.status.push(`取得玩家資訊`)
      this.profile = await db.getPlayer(this.fingerprint)
      if (!this.profile) {
        this.$router.push({ name: 'Register' })
        throw `The player hasn't registered.`
      }
    },
    async checkRepeatLogin () {
      this.status.push(`檢查登入狀態`)
      if (await db.getIsLoggedIn(this.roomId, this.fingerprint)) {
        this.disconnect()
        throw `Repeated login!`
      }
    },
    async checkRoom () {
      this.status.push(`檢查房間ID`)
      if (!(await db.getIsRoomExist(this.roomId))) {
        this.disconnect()
        throw `The room doesn't exist.`
      }
    },
    async joinRoom () {
      this.status.push(`登記中`)
      await db.joinRoom(this.roomId, this.fingerprint)
    },
    async leaveRoom () {
      this.isLoading = true
      this.status.push(`離開房間中`)

      this.sendSystemInfo(`${this.profile.name} has left.`)
      this.linstenList.forEach(child => db.offRoom(this.roomId, child))
      await db.leaveRoom(this.roomId, this.fingerprint)
      db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().cancel()  // 解除綁定
      db.roomRef.child(`${this.roomId}/chat/${this.session}`).onDisconnect().cancel()
    },
    goToIndex () {
      this.$router.push({ name: 'Index' })
    },
    sendSystemInfo (message) {
      this.$refs.chat.sendChat(this.roomId, message, null)
    },
    clickChangeRoomName () {
      this.newRoomName = this.roomName
      this.page = `name`
    },
    async confirmRoomName () {
      await this.changeRoomName(this.newRoomName)
      this.page = `game`
    },
    async changeRoomName (name = ``) {
      if (name.trim() === ``) throw `Empty room name!`
      const info = { name }
      await db.setRoomInfo(this.roomId, info)
    }
  },
  computed: {
    roomName () {
      return (this.info) ? this.info.name : null
    },
  },
  watch: {
  },
  beforeDestroy () {
    console.log(`beforeDestroy`)
    this.leaveRoom()
  },
  components: {
    Logo,
    Chat,
    Nickname,
  },
  mixins: [common]
}
</script>

<style scoped lang="sass">
.row
  justify-content: center
  align-items: center

#player-list
  ul
    display: flex
    font-size: .8rem
    margin-bottom: 0
    li
      color: white
      background-image: $black-gradient
      margin-right: .5rem
      padding: .1rem .5rem
      border-radius: 100px
</style>
