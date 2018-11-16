<template lang="pug">
.item(:class='getRoomItemClass(getPlayersCount(room.players))')
  h4(v-if='room.info')
    | {{ room.info.name }}
    small {{ room.key }}
  .description
    span.date(v-if='room.info') {{ convertDate(room.info.createDate, true) }}
    span.player-count
      span.icon #[fa(icon='user')]
      b {{ getPlayersCount(room.players) }}
      | /2
</template>

<script>
import { common } from '@/mixins/common'

export default {
  name: 'RoomListItem',
  props: {
    room: {
      type: Object,
      default: null,
    }
  },
  methods: {
    getRoomItemClass (n) {
      const classMap = {
        0: `empty`,
        1: `waiting`,
        2: `full`,
      }
      return classMap[n] || `full`
    },
  },
  mixins: [common]
}
</script>

<style scoped lang="sass">
.item
  padding: .7rem 1rem
  margin-bottom: .25rem
  cursor: pointer
  +mx(.25rem /2 )
  +block-border
  overflow: hidden
  &:hover
    border-color: $gray-400
  h4
    font-weight: 400
    font-size: 1.2rem
    margin-bottom: .5rem
    small
      color: $gray-500
      font-family: $font-family-monospace
      +mx(.5rem)
  .description
    font-size: .8rem
    +flex-center
    flex-direction: row
    justify-content: space-between
    .date
      color: $gray-500
    .icon
      margin-right: .25rem
    b
      font-weight: normal
  &.empty
    .player-count
      color: $gray-500
  &.waiting
    .player-count
      color: $blue
      b
        font-weight: bold
  &.full
    opacity: .5
    cursor: not-allowed
    +block-border
    .player-count
      color: $red
</style>
