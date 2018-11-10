<template lang="pug">
#logo
  h1
    .back-btn(v-if='name')
      a(href='#' @click='back()' v-if='name'): fa(icon='angle-left')
    img(src='/icon.png')
    span() Gomoku
  h2(v-if='name' @click='clickRoomName()') {{ name }}
</template>

<script>
export default {
  name: 'Logo',
  props: {
    name: {
      type: String,
      default: null
    }
  },
  methods: {
    back () {
      if (this.name)
        this.$router.push({ name: `Index` })
    },
    clickRoomName () {
      this.$emit('clickRoomName')
    }
  }
}
</script>

<style scoped lang="sass">
#logo
  +flex-center
  +my(.5rem)
  margin-top: 2rem

h1
  +flex-center
  flex-direction: row
  position: relative
  font-weight: 900
  font-size: 2rem
  letter-spacing: -.1rem
  span
    +gradient-text(linear-gradient(25deg, black 0%, rgba(#434343, .7) 100%))
    margin-left: .3rem
  img
    width: auto
    height: 2.5rem
    vertical-align: baseline

h2
  padding: .2rem .7rem
  font-weight: bold
  font-size: 1.5rem
  cursor: pointer
  color: white
  box-shadow: 0 0 10px rgba(black, .2)
  transform: translateY(-.2rem) skewX(15deg)
  background-clip: border-box
  background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)

@include media-breakpoint-down(md)
  h2
    margin-bottom: 0

h1
  & > .back-btn
    border-radius: 10px
    position: absolute
    top: 0
    left: -1.5rem
    height: 100%
    a
      font-size: 2rem
      color: $gray-400
      transition: color .2s
    &:hover a
      color: $gray-500
</style>
