<template lang="pug">
main
  #lobby.container
    .row
      .col-12.col-md-5.col-lg-5
        nav
          a.block.new(href='#')
            h3 New
          .block.join
            h3 Join
            .input-area
              input(v-model='roomId')
              a.submit(href='#') #[fa(icon='angle-right')]
          router-link.block.profile(:to='{ name: `ModifyProfile` }')
            div(v-if='profile')
              h3 #[fa(icon='user')] {{ profile.name }}
            div(v-else) #[fa(icon='ellipsis-h')]
            //- .fingerprint(v-if='fingerprint') {{ fingerprint }}
      .col
        h2 Latest Created
        #room-list
          ul
            li(v-for='i in 5')
              h4 Room Name #[small ab12]
              .description
                span 幾秒前
                span #[fa(icon='user')] 1/2
</template>

<script>
import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'

import moment from 'moment'
export default {
  name: 'Index',
  data () {
    return {
      fingerprint: null,
      profile: null,
      roomId: `abc`
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
  },
  methods: {

  },
  components: {
  }
}
</script>

<style scoped lang="sass">
main
  +flex-center
  height: 100vh

#lobby
  +block-border
  .row
    +my(1rem)
nav
  >.block
    +flex-center
    margin-bottom: 1rem
    flex-direction: column
    background-color: $gray-100
    min-height: 10rem
    color: white
    h3
      font-size: 1.5rem
      font-weight: 700
      font-style: italic
      margin-bottom: 0
    &.new
      background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)
    &.join
      background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%)
      &:hover
        .input-area
          opacity: 1
          max-height: 10rem
      .input-area
        width: 100%
        margin-top: .5rem
        +flex-center
        +px(2rem)
        transition: all .3s
        opacity: 0
        max-height: 0
        input
          display: inline-block
          margin-right: .5rem
          font-size: 1rem
        a.submit
          display: inline-block
          color: white
    &.profile
      font-size: 1.2rem
      color: $black
      margin-bottom: 0
      .fingerprint
        font-size: .8rem
        color: $gray-500
        overflow: hidden
    &:hover

h2
  text-transform: uppercase
  margin-bottom: 1rem

#room-list
  max-height: 26rem
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
