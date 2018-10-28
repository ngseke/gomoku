<template lang="pug">
.dialog
  h2 Nickname
  div.input-area
    input(:value='value' @input=`$emit('input', $event.target.value)` @focus='inputOnFocus()')
    a.btn-dice(href='#' @click='setRandomName()') #[fa(icon='dice')]
  div
    a.text-success.btn-confirm(href='#' @click='confirm()') V
    //- | {{ isFirst }} {{ inputOnFocusCounter }}
</template>

<script>
export default {
  name: 'Nickname',
  props: ['value', 'isFirst'],
  props: {
    value: String,
    isFirst: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      chineseCharacters: `宥翔語彤廷宇恩承恩品恩宸柏妍詠辰志豪沛恩綺妤芯語偉家冠`,
      inputOnFocusCounter: 0,
    }
  },
  mounted () {
    if(this.isFirst) this.setRandomName()
  },
  methods: {
    confirm () {
      if (this.value.length !== 0)
        this.$emit('confirm')
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
  position: absolute
  right: .5rem

</style>
