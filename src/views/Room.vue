<template lang="pug">
main
  Logo(:name='roomName')
  .container(v-if='!isWaiting')
    .row
      .col-12.col-lg-3
        ul#player-list
          li(v-for='p in players') #[fa(icon='user')]  {{ p.info.name }}
      .col-12.col-lg
  .loader(v-if='isWaiting')
    span #[fa(icon='circle-notch' spin)] {{ status[(status.length - 1)] }}
</template>

<script>
import Logo from '@/components/Logo.vue'
import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'
import moment from 'moment'

export default {
  name: 'Room',
  data () {
    return {
      info: null,
      players: null,
      isWaiting: null,
      fingerprint: null,
      roomId: null,
      profile: null,
      status: [``],
    }
  },
  mounted() {
    this.status.push(`初始化...`)
    this.init()
  },
  methods: {
    async init () {
      this.roomId = this.$route.params.id
      this.isWaiting = true
      await this.setProfile()
      await this.checkRoom()
      await this.joinRoom()

      this.status.push(`監聽房間info`)
      db.onRoom(this.roomId, `info`, (data) => this.info = data)
      db.onRoom(this.roomId, `players`, (data) => this.players = data)

      db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().remove()
      this.isWaiting = false
    },
    convertDateText (x) {
      return moment(x).format(`YYYY/MM/DD HH:mm:ss`)
    },
    disconnect () {

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
        this.$router.push({ name: `Index` })
        throw `The room doesn't exist.`
      }
    },
    async joinRoom () {
      this.status.push(`登記加入房間中`)
      await db.joinRoom(this.roomId, this.fingerprint)
    },
    async leaveRoom () {
      this.status.push(`離開房間中`)
      await db.leaveRoom(this.roomId, this.fingerprint)
    },
  },
  computed: {
    roomName () {
      return (this.info) ? this.info.name : null
    },
  },
  beforeDestroy() {
    db.roomRef.child(`${this.roomId}/players/${this.fingerprint}`).onDisconnect().cancel
    db.offRoom(this.roomId, `info`)
    db.offRoom(this.roomId, `players`)
    this.leaveRoom()
  },
  beforeRouteLeave (to, from, next) {

    next()
  },
  components: {
    Logo
  },
}
</script>

<style scoped lang="sass">
.row
  justify-content: center
  align-items: center

#player-list
  +flex-center
  align-items: flex-start
  list-style: none
  padding: 0
  font-size: .8rem
  li
    margin-bottom: .2rem
</style>
