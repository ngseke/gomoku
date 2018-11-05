<template lang="pug">
- const size = 15
#board
  .result
  .area(v-if='board' :class='areaClass')
    - for (let row = 0; row < size; row++)
      .row
        - for (let col = 0; col < size; col++)
          .block(id=`b${row}${col}` ref=`block${row}${col}` @click=`clickBlock(${row}, ${col})`  :class=`getBlockClass(${row}, ${col})`)
            .line(:class=`getLineClass(${row}, ${col})`)
            .mini-dot
            .chess.preview(v-if=`isMyTurn && board[${row}][${col}] === 0`)
            transition-group(name='block-item' style={ zIndex: 50 })
              .chess.black(v-if=`board[${row}][${col}] === 1` key=`chess1-${row}${col}`)
              .chess.white(v-else-if=`board[${row}][${col}] === 2` key=`chess2-${row}${col}`)
</template>

<script>
import moment from 'moment'
import firebase from 'firebase/app'
import chessBoard from '@/assets/js/chessBoard'

const interval = 20

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
      if (this.isWaiting) return `Now waiting!`

      nextGame.board[row][col] = this.chess
      nextGame.previous = {
        chess: this.chess,
        position: { row, col }
      }

      const checkWinner = chessBoard.checkFullBoard(this.board)
      if (checkWinner.chess !== 0) {
        nextGame.result = {
          date: firebase.database.ServerValue.TIMESTAMP ,
          player: this.fingerprint,
          content: checkWinner,
          board: nextGame.board.slice()
        }
        nextGame.board = chessBoard.getNewBoard(15)
        nextGame.previous.position = null
      }

      this.$emit(`clickBlock`, nextGame)
    },
    getBlockClass (row, col) {
      const previous = this.game.previous

      return {
        previous: previous.position ? (previous.position.row === row && previous.position.col === col) : false
      }
    },
    getLineClass (row, col) {
      return ``
    },
    setTimer () {
      if (this.timer === null) {
        this.timer = setInterval(this.setTimeToStart, 500)
      }
    },
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
    },
    setTimeToStart () {
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
    board () {
      if(this.timeToStart === null) return null
      if (this.timeToStart < 0) {
        return this.game ? this.game.board : null
      } else {
        return (this.game.result) ? this.game.result.board : null
      }
    },
    areaClass () {
      return { disabled: !this.isMyTurn }
    },
    isFirstTime () {
      return this.game ? (this.game.previous.chess === 0) : null
    },
    isIWin () {
      return this.isWaiting ? (this.game.result.content.chess === this.chess) : null
    },
    isMyTurn () {
      return this.game ? (this.game.previous.chess !== this.chess) : null
    },
    isWaiting () {
      return this.timeToStart >= 0 && this.timeToStart !== null
    },
    whosTurn () {
      if (!this.game) return null
      else if (this.game.previous.chess === 1) return 2
      else if (this.game.previous.chess === 2) return 1
      return null
    }
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
$inner-border-color: $gray-400
$outter-border-color: $gray-400
$mini-dot-size: .3rem

#board
  +flex-center
  height: $block-size * $num-per-row
  width: $block-size * $num-per-row
  margin: auto
  position: relative

.area.disabled
  cursor: not-allowed

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
  .mini-dot
    position: absolute
    border: 0
    border-radius: $mini-dot-size
    width: $mini-dot-size
    height: $mini-dot-size
    background-color: $inner-border-color
    top: calc(50% - #{$mini-dot-size} / 2)
    left: calc(50% - #{$mini-dot-size} / 2)
    z-index: 1
  &.previous
    background-color: rgba($gray-500, .3)
  &:hover
    .chess.preview
      border: dotted rgba($gray-500, .5) 2px
  &::after
    position: absolute
    top: 50%
    width: 100%
    content: ''
    border-top: solid $inner-border-color 1px
    z-index: 10
  &::before
    position: absolute
    left: 50%
    height: 100%
    content: ''
    border-left: solid $inner-border-color 1px
    z-index: 10

.chess
  height: $block-size - .5rem
  width: $block-size - .5rem
  border-radius: 100%
  z-index: 20

  &.black
    background-image: $black-gradient
  &.white
    border: solid $gray-500 1px
    background-color: white
    background-image: $white-gradient
  &.preview
    transition: all .1s
    border: dotted rgba($gray-500, 0) 2px

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
