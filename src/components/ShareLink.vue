<template lang="pug">
.block(title='分享網址邀請朋友加入房間同樂 (如果你有的話)')
  h6
    fa.icon(icon='sign-in-alt')
    span Invite your friend to this room
  .input-box
    input(type='text' v-model='link' @focus='copy()' ref='inputBox')
    transition(name='fade-in')
      .copyed-text(v-if='isCopied')
        fa.mr-1(icon='check')
        | Copied
</template>

<script>
export default {
  name: 'ShareLink',
  data () {
    return {
      link: null,
      isCopied: false,
      timer: null
    }
  },
  mounted() {
    this.link = location.href
  },
  methods: {
    copy() {
      this.$refs.inputBox.select()
      document.execCommand('copy')
      this.isCopied = true
      if (!this.timer)
        this.timer = setTimeout(() => {
          this.isCopied = false
          this.timer = null
        }, 1500)
    }
  }
}
</script>

<style scoped lang="sass">
$theme-gradient: linear-gradient(to right, #4facfe 0%, #00f2fe 100%)

.fade-in-enter-active, .fade-in-leave-active
  transition: all .3s ease

.fade-in-enter, .fade-in-leave-to
  opacity: 0
  transform: translateX(3rem)

.block
  +block-border
  padding: 1rem

.input-box
  position: relative
  background-color: blue
  display: flex
  overflow: hidden

h6, input
  font-size: .8rem
  margin: 0

h6
  span
    +gradient-text($theme-gradient)
  .icon
    color: #4facfe
    margin-right: .5rem
  margin-bottom: .25rem
  font-weight: bold

input
  // cursor: pointer

.copyed-text
  text-align: center
  position: absolute
  color: white
  font-size: .8rem
  font-weight: 900
  height: 100%
  width: auto
  top: 0
  right: 0
  background-image: $theme-gradient
  // opacity: .9
  +px(.5rem)

</style>
