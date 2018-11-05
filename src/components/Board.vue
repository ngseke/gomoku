<template lang="pug">
- const size = 15
#board
  .result
  .area(v-if='board')
    - for (let row = 0; row < size; row++)
      .row
        - for (let col = 0; col < size; col++)
          .block(id=`b${row}${col}` ref=`block${row}${col}` @click=`clickBlock(${row}, ${col})`  :class=`{ previous: isBlockPrevious(${row}, ${col}) }`)
            .line(:class=`getLineClass(${row}, ${col})`)
            transition(name='block-item' mode='out-in')
              .chess.black(v-if=`board[${row}][${col}] === 1` key=`chess1-${row}${col}`)
            transition(name='block-item' mode='out-in')
              .chess.white(v-if=`board[${row}][${col}] === 2` key=`chess2-${row}${col}`)
</template>

<script>
import moment from 'moment'
import chessBoard from '@/assets/js/chessBoard'

const interval = 5

export default {
  name: 'Board',
  data () {
    return {
      timeToStart: null,
      timer: null,
    }
  },
  props: {
    game: {
      type: Object,
      default: null,
    },
    chess: {
      type: Number,
      default: 0,
    },
    fingerprint: {
      type: String,
      default: null,
    }
  },
  mounted() {
  },
  methods: {
    clickBlock (row, col)  {
      const nextGame = Object.assign({}, this.game)

      if (nextGame.previous.chess === this.chess) return `Not your turn!`
      if (nextGame.board[row][col] !== 0) return `This place has been taken!`

      nextGame.board[row][col] = this.chess
      nextGame.previous = {
        chess: this.chess,
        position: { row, col }
      }

      const checkWinner = chessBoard.checkFullBoard(this.board)
      console.log(checkWinner)
      if (checkWinner.chess !== 0) {
        nextGame.result = {
          date: +new Date(),
          player: this.fingerprint,
          content: checkWinner,
          board: nextGame.board.slice()
        }
        nextGame.board = chessBoard.getNewBoard(15)
      }

      this.$emit(`clickBlock`, nextGame)
    },
    isBlockPrevious (row, col) {
      return false
    },
    getLineClass (row, col) {
      return ``
    },
    setTimer () {
      console.log(`setTimer`)
      if (this.timer === null) {
        this.timer = setInterval(this.setTimeToStart, 500)
      }
    },
    clearTimer () {
      console.log(`clearTimer`)
      clearInterval(this.timer)
      this.timer = null
    },
    setTimeToStart () {
      console.log(`setTimeToStart`)
      if (!this.game || !this.game.result) {
        this.timeToStart = -1
        this.clearTimer()
        return
      }

      const lastDate = moment(this.game.result.date).add(interval, 's')
      const now = moment()

      if (now.isBefore(lastDate)) {
        const duration = moment(lastDate - now).format('s')
        this.timeToStart = duration
      } else {
        this.timeToStart = -1
        this.clearTimer()
      }

      return this.setTimeToStart
    },
  },
  computed: {
    // board () {
    //   return this.game ? this.game.board : null
    // },
    board () {
      if(this.timeToStart === null) return null
      if (this.timeToStart < 0) {
        return this.game ? this.game.board : null
      } else {
        return (this.game.result) ? this.game.result.board : null
      }
    },
    isFirstTime () {
      return this.game ? (this.game.previous.chess === 0) : null
    },
    isMyTurn () {
      return this.game ? (this.game.previous.chess !== this.chess) : null
    },
    isWaiting () {
      return this.timeToStart >= 0 && this.timeToStart !== null
    },
  },
  watch: {
    'game.board': {
      handler () {
        this.setTimer()
      },
      deep: true
    }
  },
}
</script>

<style scoped lang="sass">
$block-size: 2rem
$num-per-row: 15
$inner-border-color: $gray-500
$outter-border-color: $gray-600

#board
  +flex-center
  height: $block-size * $num-per-row
  width: $block-size * $num-per-row
  margin: auto
  position: relative

.result
  position: absolute
  top: 0
  left: 0
  color: $red
  z-index: 999

.row
  overflow: visible
  white-space: nowrap

.block
  position: relative
  width: $block-size
  height: $block-size
  margin: 0
  +flex-center
  &::after
    position: absolute
    top: 50%
    width: 100%
    content: ''
    border-top: solid $inner-border-color 1px
    z-index: 1
  &::before
    position: absolute
    left: 50%
    height: 100%
    content: ''
    border-left: solid $inner-border-color 1px
    z-index: 1

.chess
  height: $block-size - .5rem
  width: $block-size - .5rem
  border-radius: 100%
  z-index: 2
  &.black
    background-image: $black-gradient
  &.white
    border: solid $gray-300 1px
    background-color: white
    background-image: $white-gradient

#board
  .area
    .row
      .block:first-child
        &::after
          right: 0
          width: 50%
        &::before
          border-color: $outter-border-color
      .block:last-child
        &::after
          left: 0
          width: 50%
        &::before
          border-color: $outter-border-color
      &:first-child
        .block
          &::before, &:first-child::before
            bottom: 0
            height: 50%
          &::after
            border-color: $outter-border-color
          &:first-child
            &::after
              right: 0
              width: 50%
          &:last-child::after
              left: 0
              width: 50%
      &:last-child
        .block
          &::before, &:first-child::before
            top: 0
            height: 50%
          &::after
            border-color: $outter-border-color
          &:first-child
            &::after
              right: 0
              width: 50%
          &:last-child::after
              left: 0
              width: 50%

</style>
