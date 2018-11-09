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
            .block.join
              h3 Join
              .input-area
                input(type='text' v-model='roomIdText' @keyup.enter='enterRoom(roomIdText)' maxlength='4')
                a.submit(href='#' @click='enterRoom(roomIdText)') #[fa(icon='check')]
          .col-12
            router-link.block.profile(:to='{ name: `ModifyProfile` }')
              div(v-if='profile')
                h3(:title='fingerprint') #[fa(icon='rocket')] {{ profile.name }}
                h4.record(v-if='profile.record')
                  span 勝#[b.win {{ profile.record.win }}]  負#[b.lose {{ profile.record.lose }}]
                  span(v-if='getWinRate(profile.record.win, profile.record.lose, profile.record.even)')  勝率#[b {{ getWinRate(profile.record.win, profile.record.lose, profile.record.even) }}%]
              div(v-else): fa(icon='circle-notch' spin)
      .col.mt-5.mt-md-0
        h2 Rooms
        #room-list
          .no-room(v-if='isRoomLoaded && !rooms' key='empty-label') No room
          .loader(v-else-if='!rooms')
            span.icon: fa(icon='circle-notch' spin)
          transition-group.row.no-gutters(name='room-item')
            .col-12.col-lg-6(v-for='i in roomList' :key='i.key' @click='enterRoom(i.key)' )
              .item(:class='getRoomItemClass(getPlayersCount(i.players))')
                h4(v-if='i.info') {{ i.info.name }} #[small {{ i.key }}]
                .description
                  span.date(v-if='i.info') {{ convertDate(i.info.createDate, true) }}
                  span.player-count
                    span.icon #[fa(icon='user')]
                    | #[b {{ getPlayersCount(i.players) }}]/2
  .loader(v-if='isLoading')
    span.icon: fa(icon='circle-notch' spin)
    span {{ status[(status.length - 1)] }}
  footer
    .container
      span= `build: ${+new Date()} `
      span(v-if='fingerprint')  / #[fa(icon='fingerprint')] {{ fingerprint.substring(0, 4)  }}
</template>

<script>
import Logo from '@/components/Logo.vue'
import { common } from '@/mixins/common'

import fingerprint from '@/assets/js/fingerprint'
import room from '@/assets/js/room'
import db from '@/assets/js/db'

import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Index',
  data () {
    return {
      roomIdText: ``,
      rooms: null,
      isRoomLoaded: false
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

      db.roomRef.orderByChild('date').limitToLast(100).on(`value`, snap => {
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
    }
  },
  beforeDestroy () {
    console.log(`beforeDestroy Index`)
  },
  components: {
    Logo
  },
  mixins: [common]
}
</script>

<style scoped lang="sass">
@import "../assets/css/lobby"
@import "../assets/css/roomList"

h2
  display: block
  text-transform: uppercase
  margin-bottom: .5rem
  text-align: center

footer
  margin-top: 2rem
  color: $gray-500
  font-size: .8rem
</style>
