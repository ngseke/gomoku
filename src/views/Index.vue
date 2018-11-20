<template lang="pug">
main
  Logo
  #lobby.container(v-show='!isLoading')
    .row
      .col-12.col-md-5.col-lg-4
        nav.row.no-gutters
          .col-12.col-md-12
            a.block.new(href='#' @click='createRoom()')
              h3 New
          .col.col-md-12
            .block.join(@click='onFocusJoinBtn()' :class=`{ 'clear-hover': isJoinInputShow }`)
              transition(name='join-btn' mode='out-in' @after-enter='onFocusJoinInput')
                h3(v-if='!isJoinInputShow') Join
                .input-area(v-else)
                  input(type='text' ref='joinInput' v-model='roomIdText' @keyup.enter='enterRoom(roomIdText)' maxlength='4')
                  a.submit(href='#' @click='enterRoom(roomIdText)' :class='{ hide: roomIdText === ``}') #[fa(icon='chevron-right')]
                  small 輸入房間 ID 以加入
          .col-12
            router-link.block.profile(:to='{ name: `ModifyProfile` }')
              div(v-if='profile')
                h3(:title='fingerprint') #[fa(icon='rocket')] {{ profile.name }}
                h4.record(v-if='profile.record')
                  span 勝#[b.win: CountUp(:endVal='profile.record.win')]
                  span  負#[b.lose: CountUp(:endVal='profile.record.lose') ]
                  span(v-if='getWinRate(profile.record.win, profile.record.lose, profile.record.even)')
                    |  勝率
                    b {{ getWinRate(profile.record.win, profile.record.lose, profile.record.even) }}%
              div(v-else): fa(icon='circle-notch' spin)
      .col.mt-3.mt-md-0
        #room-list
          .no-room(v-if='isRoomLoaded && !rooms' key='empty-label') No room
          .loader(v-else-if='!rooms')
            span.icon: fa(icon='circle-notch' spin)
          transition-group.row.no-gutters(name='room-item')
            .col-12.col-lg-6(v-for='room in roomList' :key='room.key' @click='enterRoom(room.key)' )
              RoomListItem(:room='room')
  .loader(v-if='isLoading')
    span.icon: fa(icon='circle-notch' spin)
    span {{ status[(status.length - 1)] }}

  transition(name='full-loader')
    #full-loader(v-if='isFullLoaderShow')
      Logo(:isForFullLoader='true').my-0

  footer
    .container
      span(v-if='fingerprint' :title='`fingerprint: ${fingerprint}`') #[fa(icon='fingerprint')] {{ fingerprint.substring(0, 4) }}
</template>

<script>
import Logo from '@/components/Logo.vue'
import RoomListItem from '@/components/RoomListItem.vue'
import { common } from '@/mixins/common'

import fingerprint from '@/assets/js/fingerprint'
import room from '@/assets/js/room'
import db from '@/assets/js/db'

import moment from 'moment'
import _ from 'lodash'
import CountUp from 'vue-countup-v2'

export default {
  name: 'Index',
  data () {
    return {
      roomIdText: ``,
      rooms: null,
      isRoomLoaded: false,
      isJoinInputShow: false,
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.fingerprint = await fingerprint.get()
      const profile = await db.getPlayer(this.fingerprint)
      if (!profile) this.$router.push({ name: 'Register' })
      else this.profile = profile

      db.roomRef.orderByChild('date').limitToLast(10).on(`value`, snap => {
        this.rooms = snap.val()
        this.isRoomLoaded = true
      })
    },
    async createRoom () {
      this.isLoading = true
      this.status.push(`創建中`)
      const id = await db.createRoom(this.fingerprint)
      this.$router.push({ name: `Room`, params: { id } })
    },
    async enterRoom (id) {
      this.isLoading = true
      id = id.toUpperCase()
      if (id === `` || !(/^[\d|a-zA-Z]+$/.test(id))) {
        this.isLoading = false
        throw `Invalid room id!`
      }
      if (!await db.getIsRoomExist(id)) {
        this.isLoading = false
        throw `The room doesn't exist!`
      }
      if (await db.getRoomPlayerCount(id) >= 2) {
        this.isLoading = false
        throw `The room is full!`
      }
      this.$router.push({ name: `Room`, params: { id } })
    },
    getRoomItemClass (n) {
      const classMap = {
        0: `empty`,
        1: `waiting`,
        2: `full`,
      }
      return classMap[n] || `full`
    },
    getWinRate (win, lose, even = 0) {
      try {
        const result = ((win / (win + lose + even)) * 100).toFixed(0)
        if (isNaN(result)) return null
        return result
      } catch (e) {
        return null
      }
    },
    onFocusJoinBtn () {
      this.isJoinInputShow = true
    },
    onFocusJoinInput () {
      if (this.isJoinInputShow)
        this.$nextTick(() => { this.$refs.joinInput.focus() })
    }
  },
  computed: {
    roomList () {
      const rooms = Object.assign({}, this.rooms)
      const result = _(rooms)
        .map((v, k) => _.merge({}, v, { key: k }))
        .sortBy('info.createDate')
        .value()
      if (!this.rooms) return null
      return _.orderBy(result, `info.createDate`).reverse()
    },
    isFullLoaderShow () {
      return !this.isRoomLoaded || !this.profile
    }
  },
  beforeDestroy () {
  },
  components: {
    Logo,
    CountUp,
    RoomListItem,
  },
  mixins: [common]
}
</script>

<style scoped lang="sass">
@import "../assets/css/lobby"

h2
  display: block
  text-transform: uppercase
  margin-bottom: .5rem
  text-align: center

footer
  margin-top: 2rem
  margin-bottom: 1rem
  color: $gray-500
  font-size: .8rem
  font-family: $font-family-monospace
</style>
