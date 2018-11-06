<template lang="pug">
#logo
  h1
    a(href='#' @click='back()' v-if='name'): fa(icon='angle-left')
    span Gomoku
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
  font-weight: 900
  text-transform: uppercase
  font-size: 2.5rem
  span
    +gradient-text(linear-gradient(25deg, black 0%, rgba(#434343, .7) 100%))
  a
    font-size: 2rem
    opacity: .5
    margin-right: 1rem
    color: $gray-400
    &:hover
      color: $gray-500
  img
    width: auto
    height: 1.2rem
    vertical-align: baseline
h2
  padding: .2rem .5rem
  font-weight: 500
  font-size: 1.5rem
  color: white
  cursor: pointer
  transform: translateY(-.2rem) skewX(15deg)
  background-clip: border-box
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%)
  text-shadow: 0 0 5px rgba(black, .3)

</style>
