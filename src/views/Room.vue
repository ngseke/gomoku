<template lang="pug">
main
  Logo(:name='roomName')
  .container(v-if='!isLoading')
    .row
      .col-12.col-md-4
        #player-list
          ul
            li(v-for='p in players' :title='`加入遊戲時間: ${convertDate(p.date)}`') #[fa(icon='user')]  {{ p.info.name }}
        Chat(:roomId='roomId' :fingerprint='fingerprint')
      .col-12.col-md
  .loader(v-if='isLoading')
    span #[fa(icon='circle-notch' spin)]
    span {{ status[(status.length - 1)] }}
</template>

<script>
import Logo from '@/components/Logo.vue'
import Chat from '@/components/Chat.vue'
import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'
import moment from 'moment'

export default {
  name: 'Room',
  data () {
    return {
      linstenList: [`info`, `players`, `game`],
      info: null,
      players: null,
      game: null,
      //
      isLoading: null,
      fingerprint: null,
      roomId: null,
      profile: null,
      status: [``],
    }
  },
  created () {
    this.roomId = this.$route.params.id   // 根據網址參數設定 roomId
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

      // 當 `遠端` 偵測本機離線時，移除 players 中的玩家本人
      db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().remove()
      this.isLoading = false
    },
    convertDate (x, isFromNow = false) {
      if (isFromNow) return moment(x).fromNow()
      return moment(x).format(`YYYY/MM/DD HH:mm:ss`)
    },
    async disconnect () {
      // await this.leaveRoom()
      this.goToIndex()
    },
    async setProfile () {
      this.status.push(`取得裝置指紋中`)
      this.fingerprint = await fingerprint.get()
      this.status.push(`取得玩家資訊`)
      this.profile = await db.getPlayer(this.fingerprint)
      if (!this.profile) {
        this.status.push(`未註冊玩家`)
        this.$router.push({ name: 'Register' })
        throw `The player hasn't registered.`
      }
    },
    async checkRoom () {
      this.status.push(`檢查房間ID`)
      if (!(await db.getIsRoomExist(this.roomId))) {
        this.goToIndex()
        throw `The room doesn't exist.`
      }
    },
    async joinRoom () {
      this.status.push(`登記中`)
      await db.joinRoom(this.roomId, this.fingerprint)
    },
    async leaveRoom () {
      this.status.push(`離開房間中`)
      this.linstenList.forEach(child => db.offRoom(this.roomId, child))
      await db.leaveRoom(this.roomId, this.fingerprint)
      db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().cancel
    },
    goToIndex () {
      this.$router.push({ name: 'Index' })
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
    this.leaveRoom()
  },
  beforeRouteLeave (to, from, next) {
    this.leaveRoom().then(() => next())
  },
  components: {
    Logo,
    Chat
  },
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
    padding: 0
    li
      color: white
      background-image: $black-gradient
      margin-right: .5rem
      padding: .1rem .5rem
      border-radius: 100px
</style>
