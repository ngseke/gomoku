<template lang="pug">
main
  #lobby.container
    .row
      .col-12.col-md-4
        nav
          a.block.new(href='#') New
          .block.join(href='#')
            div Join
            .input-area
              input(v-model='roomId')
              a.submit(href='#') #[fa(icon='angle-right')]
      .col-auto
</template>

<script>
import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'

export default {
  name: 'Index',
  data () {
    return {
      player: null,
      roomId: `abc`
    }
  },
  mounted () {
    fingerprint.get()
      .then(fingerprint => db.getPlayer(fingerprint))
      .then(player => {
        if (!player) this.$router.push({ name: 'Register' })
        else this.player = player
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
  nav
    +my(1rem)
    >.block
      +flex-center
      +my(1rem)
      flex-direction: column
      font-weight: 700
      background-color: $gray-100
      min-height: 7rem
      font-size: 1.5rem
      color: white
      font-style: italic
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
          +flex-center
          +px(2rem)
          transition: all .3s
          // opacity: 0
          // max-height: 0
          input
            display: inline-block
            margin-right: .5rem
            font-size: 1rem
          a.submit
            display: inline-block
            color: white
</style>
