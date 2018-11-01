<template lang="pug">
#logo
  h1
    | Xiaqi
    |
    img(src='@/assets/logo.png')
    a(href='https://console.firebase.google.com/u/0/project/xiaqi-game/database' target='_blank')
      img(src='https://cdn-images-1.medium.com/max/1600/1*R4c8lHBHuH5qyqOtZb3h-w.png')
  h2(v-if='name') {{ name }}
</template>

<script>
export default {
  name: 'Logo',
  props: {
    name: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped lang="sass">
#logo
  +flex-center
  +my(1rem)
  margin-top: 2rem

h1
  display: inline-block
  color: $yellow
  color: $black
  +gradient-text(linear-gradient(25deg, black 0%, rgba(#434343, .7) 100%))
  font-weight: 900
  text-transform: uppercase
  font-size: 3rem
  img
    width: auto
    height: 1.2rem
    vertical-align: baseline
h2
  padding: .2rem .5rem
  font-weight: 500
  font-size: 1.5rem
  color: white
  transform: translateY(-.2rem) skewX(20deg)
  background-clip: border-box
  background-image: radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)

</style>
