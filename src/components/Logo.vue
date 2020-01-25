<template lang="pug">
#logo
  h1(:class='{ column: isForFullLoader }')
    .back-btn(v-if='name || $route.name === `About`')
      a(href='#' @click='back()'): fa(icon='angle-left')
    img(:src='logoImg')
    span(v-if='!isForFullLoader') Gomoku
    router-link.about-btn(to='/about' v-if='!isForFullLoader && !name && $route.name === `Index`')
      fa.icon(icon='star')
  h2(v-if='name' @click='clickRoomName()' title='修改房名') {{ name }}
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      logoImg: require('@/assets/icon.png')
    }
  },
  props: {
    name: {
      type: String,
      default: null
    },
    isForFullLoader: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    back () {
      this.$router.push({ name: `Index` })
    },
    about () {
      this.$router.push({ name: `About` })
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
  font-family: $font-family-sans-serif
  font-weight: 900
  font-size: 2rem
  span
    +gradient-text(linear-gradient(25deg, black 0%, rgba(#434343, .7) 100%))
    letter-spacing: -.1rem
    margin-left: .3rem
  img
    width: auto
    height: 2.5rem
    vertical-align: baseline
  &.column
    flex-direction: column
    span
      margin: 0

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
  transition: all .3s
  &:hover
    transform: translateY(-.2rem) skewX(15deg) scale(1.05)
    opacity: .9

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

.about-btn
  font-size: 1rem
  // position: fixed
  // bottom: 1rem
  // right: 1rem
  +mx(.5rem)
  .icon
    color: $gray-500
</style>
