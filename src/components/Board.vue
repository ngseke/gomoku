<template lang="pug">
#board
  - let row = 0
  while row < 15
    .row
      - let col = 0
      while col < 15
        .block(id=`b${row}${col}` ref=`block${row}${col}` @click=`clickBlock(${row}, ${col})` :class=`{ previous: isBlockPrevious(${row}, ${col}) }`)
          - if(row === 1 || col === 1)
            .line(:class=`getLineClass(${row}, ${col})`)
          transition(name='block-item')
            //- .chess.black(v-if=`1 || board[${row}][${col}] === 1` key=`chess1-${row}${col}`)
          transition(name='block-item')
            //- .chess.white(v-if=`1 || board[${row}][${col}] === 2` key=`chess2-${row}${col}`)
        - col++
    - row++
</template>

<script>
export default {
  name: 'Board',
  data () {
    return {
    }
  },
  props: {
    board: {
      type: Array,
      default: null,
    },
  },
  mounted() {

  },
  methods: {
    clickBlock (row, col)  {

    },
    isBlockPrevious (row, col) {
      return false
    },
    getLineClass (row, col) {
      return ``
    }
  }
}
</script>

<style scoped lang="sass">
$block-size: 2rem
$num-per-row: 15
$outter-border-color: $yellow

#board
  +flex-center
  height: $block-size * $num-per-row
  width: $block-size * $num-per-row
  margin: auto

.row
  overflow: visible
  white-space: nowrap

.block
  position: relative
  width: $block-size
  height: $block-size
  margin: 0
  +flex-center
  // border: solid $gray-100 1px
  &::after
    position: absolute
    top: 50%
    width: 100%
    content: ''
    border-top: solid $gray-500 1px
    z-index: 1
  &::before
    position: absolute
    left: 50%
    height: 100%
    content: ''
    border-left: solid $gray-500 1px
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
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)

#board
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
