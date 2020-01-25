<template lang="pug">
.dialog.show-up
  h2(v-if='isRoomName') Room Name
  h2(v-else)
    |  Nickname
  div.input-area
    input(type='text' :value='value' @input=`$emit('input', $event.target.value)` @focus='inputOnFocus()' @keyup.stop.prevent.enter='confirm()' maxlength='30')
    a.btn-dice(href='#' @click.prevent='setRandomName' title='特約命理師幫你起名' v-if='!isRoomName')
      fa(icon='dice' v-if='!isFetching')
      fa(icon='circle-notch' spin v-else)
  div
    a.text-success.btn-confirm(href='#' @click.prevent='confirm()') O
    a.text-danger.btn-cancel(href='#' @click.prevent='$emit(`cancel`)' v-if='!isFirst || isRoomName') X
</template>

<script>
import axios from 'axios'

export default {
  name: 'Nickname',
  props: {
    value: String,
    isFirst: {
      type: Boolean,
      default: false
    },
    isRoomName: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      inputOnFocusCounter: 0,
      isFetching: false,
    }
  },
  mounted () {
    if(this.isFirst) this.setRandomName()
  },
  methods: {
    confirm () {
      // TODO: 加入防彈跳
      if (this.value.length !== 0) {
        this.$emit('confirm')
      }
    },
    async setRandomName () {
      if (this.isFetching) return
      const name = await this.getRandomName()

      this.inputOnFocusCounter = 0
      this.$emit('input', name)
    },
    async getRandomName () {
      this.isFetching = true
      try {
        const { data } = await axios.get('https://randomuser.me/api/')
        return data.results[0].name.first
      } catch (e) {
        throw 'Fail to get random name!'
      } finally {
        this.isFetching = false
      }
    },
    inputOnFocus () {
      if (this.inputOnFocusCounter++ === 0 && this.isFirst)
        this.$emit('input', ``)
    }
  }
}
</script>

<style scoped lang="sass">
.input-area
  position: relative
  width: 100%

a.btn-dice
  display: inline-block
  position: absolute
  right: .5rem
  top: 0
</style>
