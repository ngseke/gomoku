<template lang="pug">
- const size = 15
#board
  .result
  .area(v-if='board' :class='areaClass')
    - for (let row = 0; row < size; row++)
      .row
        - for (let col = 0; col < size; col++)
          .block(id=`b${row}${col}` ref=`block${row}${col}` @click=`clickBlock(${row}, ${col})`  :class=`getBlockClass(${row}, ${col})`)
            //- - if (row===5&&col===1)
              .line.topRight
            .line(:class=`getLineClass(${row}, ${col})`)
            .mini-dot
            .chess.preview(v-if=`isMyTurn && board[${row}][${col}] === 0`)
            transition(name='block-item' style={ zIndex: 50 })
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
      const classObject = {}
      if (!this.isWaiting) {
        classObject.hidden = true
      } else {
        const direction = this.game.result.content.direction
        const resultRow = this.game.result.content.row
        const resultCol = this.game.result.content.col
        if (this.isWaiting && this.game)
          if (row === resultRow && col === resultCol)
            classObject[direction] = true
        else classObject.hidden = true
      }

      return classObject
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
@import "../assets/css/board"

</style>
