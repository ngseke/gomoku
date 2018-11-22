<template lang="pug">
.status
  transition(name='status-text' mode='out-in')
    span(v-if='board.timeToStart === null' key='status-0') ...
    span.waiting(v-else-if='board.timeToStart >= 0' key='status-1') #[fa(icon='stopwatch')] 下一局即將開始... ({{ board.timeToStart }})
    span(v-else-if='board.isFirstTime === true' key='status-2') 誰都可以先下
    span.my-turn(v-else-if='board.isMyTurn === true' key='status-3') #[fa.flash(icon='hand-point-up')] 換你了
    span.waiting(v-else-if='board.isMyTurn === false' key='status-4') #[fa(icon='hourglass-start')] 等對方下...
</template>

<script>
export default {
  name: 'Status',
  data () {
    return {
    }
  },
  props: {
    board: {
      type: Object,
      default: null
    },
  },
  methods: {
  }
}
</script>

<style scoped lang="sass">
.status
  margin-top: .5rem
  text-align: center
  span
    display: inline-block
  .my-turn
    font-weight: bold
    color: #097298
  .waiting
    color: $gray-700
    font-style: italic

@include media-breakpoint-down(md)
  .status
    z-index: 300
    background-color: rgba($white, .9)
    position: fixed
    bottom: .5rem
    left: .5rem
    right: 6.5rem
    padding: .5rem .75rem
    border-radius: 10px
    // font-size: .85rem
</style>
