<template lang="pug">
main
  Logo
  #lobby.container
    .row
      .col-12.col-md-5.col-lg-5
        nav
          router-link.block.new(href='#' :to='{ name: `Room` }')
            h3 New
          .block.join
            h3 Join
            .input-area
              input(type='text' v-model='roomId' maxlength='4')
              a.submit(href='#') #[fa(icon='check')]
          router-link.block.profile(:to='{ name: `ModifyProfile` }')
            div(v-if='profile')
              h3(:title='fingerprint') #[fa(icon='user')] {{ profile.name }}
            div(v-else) #[fa(icon='ellipsis-h')]
      .col.mt-5.mt-md-0
        h2 Recently Created
        #room-list
          ul
            li
              h4 Room Name #[small ab12]
              .description
                span 幾秒前
                span #[fa(icon='user')] 1/2
</template>

<script>
import Logo from '@/components/Logo.vue'
import fingerprint from '@/assets/js/fingerprint'
import room from '@/assets/js/room'
import db from '@/assets/js/db'

import moment from 'moment'
export default {
  name: 'Index',
  data () {
    return {
      fingerprint: null,
      profile: null,
      roomId: `ab10`
    }
  },
  mounted () {
    fingerprint.get()
      .then(fingerprint => {
        this.fingerprint = fingerprint
        return db.getPlayer(fingerprint)
      })
      .then(profile => {
        if (!profile) this.$router.push({ name: 'Register' })
        else this.profile = profile
      })
    // db.createRoom()
  },
  methods: {

  },
  components: {
    Logo
  }
}
</script>

<style scoped lang="sass">
main
  // +flex-center
  // flex-direction: column
  // height: 100vh

#lobby
  +block-border
  .row
    +my(1rem)
  // max-width: 1000px
nav
  >.block
    +flex-center
    +gradient-bg($gray-200, 10%)
    margin-bottom: 1rem
    flex-direction: column
    min-height: 8rem
    color: white
    h3
      font-size: 1.5rem
      font-weight: 700
      font-style: italic
      margin-bottom: 0
      letter-spacing: .1rem
    &.new
      background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)
    &.join
      background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%)
      .input-area
        width: 100%
        margin-top: .5rem
        +flex-center
        +px(2rem)
        transition: all .3s
        input
          display: inline-block
          margin-right: .5rem
          font-size: 1rem
        a.submit
          display: inline-block
          color: white
    &.profile
      color: $black
      margin-bottom: 0
      h3
        font-style: normal
        font-size: 1rem
      .fingerprint
        font-size: .8rem
        color: $gray-500
        overflow: hidden
    &:hover

h2
  display: block
  text-transform: uppercase
  margin-bottom: 1rem
  text-align: center


#room-list
  max-height: 22rem
  overflow-x: hidden
  overflow-y: scroll
  ul
    display: flex
    flex-direction: column
    list-style: none
    padding: 0
    li
      width: 100%
      padding: .7rem 1rem
      margin-bottom: .25rem
      cursor: pointer
      +block-border
      h4
        font-weight: 400
        font-size: 1.2rem
        margin-bottom: .5rem
        small
          color: $gray-500
      .description
        font-size: .8rem
        +flex-center
        justify-content: space-between
</style>
