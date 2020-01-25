<template lang="pug">
.result(v-if='board && (board.isEven !== null || board.isIWin !== null)' :style='resultStyle')
  .even(v-if='board.isEven === true'): span {{ evenText }}
  .win(v-else-if='board.isIWin === true'): span {{ winText }}
  .lose(v-else-if='board.isIWin === false'): span {{ loseText }}
//- .result(@click='t=(t+4)%3')
  .even(v-if='t==0'): span {{ evenText }}
  .win(v-if='t==1'): span {{ winText }}
  .lose(v-if='t==2'): span {{ loseText }}
</template>

<script>
export default {
  name: 'Result',
  data () {
    return {
      t: 0,
      winText: `WIN`,
      loseText: `LOSE`,
      evenText: `EVEN`,
      winText: `你贏了`,
      loseText: `你輸了`,
      evenText: `平 手`,
    }
  },
  props: {
    board: {
      type: Object,
      default: null
    },
  },
  computed: {
    resultStyle () {
      return ''
      const style = {}
      if (this.board.isEven === true)
        style.backgroundImage = `url('')`
      else if (this.board.isIWin === true)
        returnstyle.backgroundImage = `url('http://www.pngmart.com/files/4/LOL-PNG-Transparent-Image.png')`
      else if (this.board.isIWin === false)
        style.backgroundImage = `url('http://img4.wikia.nocookie.net/__cb20130219193256/bibliotecapkmn/es/images/a/a3/Y_U_NO_(meme).png')`

      return style
    }
  }
}
</script>

<style scoped lang="sass">
@function long-shadow($color, $number: 15)
  $val: 0px 0px $color
  @for $i from 1 through $number
    $val: #{$val}, -#{$i * .5}px -#{$i * .5}px 0 $color
  @return $val

@keyframes result-in
  from
    opacity: 0
    transform: scale(2)
  to
    transform: none

.result
  user-select: none
  +flex-center
  z-index: 150
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  font-size: 4rem
  font-weight: 900
  background: no-repeat bottom left
  background-size: 30%
  & > div
    animation: result-in .5s $time-function backwards
    // text-shadow: 5px 5px 0 rgba(#333, .5)

  .win span
    +gradient-text(linear-gradient(to right, #92fe9d 0%, #00c9ff 100%))
  .lose span
    +gradient-text(linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%))
  .even span
    // +gradient-text( linear-gradient(to right, #243949 0%, #517fa4 100%))
    background-image: linear-gradient(45deg, #fb3 25%, #58a 0, #58a 50%, #fb3 0, #fb3 75%, #58a 0)
    background-size: 30px 30px
    background-clip: text
    color: transparent

@include media-breakpoint-down(md)
  .result
    position: fixed
    height: auto
    top: 50%
</style>
