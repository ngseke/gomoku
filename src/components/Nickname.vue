<template lang="pug">
.dialog.show-up
  h2(v-if='isRoomName') Room Name
  h2(v-else)
    //- template(v-if='!isFirst') Modify
    //- template(v-else) Set
    |  Nickname
  div.input-area
    input(type='text' :value='value' @input=`$emit('input', $event.target.value)` @focus='inputOnFocus()' @keyup.stop.prevent.enter='confirm()' maxlength='30')
    a.btn-dice(href='#' @click.prevent='setRandomName()' title='特約命理師幫你起名' v-if='!isRoomName') #[fa(icon='dice')]
  div
    a.text-success.btn-confirm(href='#' @click.prevent='confirm()') O
    a.text-danger.btn-cancel(href='#' @click.prevent='$emit(`cancel`)' v-if='!isFirst || isRoomName') X
</template>

<script>
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
      chineseCharacters: `宥翔語彤廷宇承恩品恩宸柏妍詠辰志豪沛恩綺妤芯語偉家冠`,
      inputOnFocusCounter: 0,
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
    setRandomName () {
      const char = this.chineseCharacters.split(``).sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0]
      const prefixs = ['阿', '小', char]
      const name = prefixs.sort((a, b) => Math.random() > 0.5 ? -1 : 1)[0] + char

      this.inputOnFocusCounter = 0
      this.$emit('input', name)
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
