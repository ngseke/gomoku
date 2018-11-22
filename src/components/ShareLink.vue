<template lang="pug">
.block(title='分享網址邀請朋友加入房間同樂 (如果你有的話)')
  h6
    fa.icon(icon='sign-in-alt')
    span Invite your friend
  .input-box
    input(type='text' v-model='link' @focus='copy()' ref='inputBox')
    transition(name='fade-in')
      .copyed-block(v-if='isCopied')
        .copyed-text
          fa.icon(icon='check')
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
  transition: all .2s ease

.fade-in-enter, .fade-in-leave-to
  opacity: 0
  transform: translateY(-.5rem)

.block
  +block-border
  padding: 1rem

.input-box
  position: relative
  display: flex
  input
    background-image: none
    background-color: transparent
    color: #333
    &:focus
      background-image: $input-background-image

h6, input
  font-size: .8rem
  margin: 0

h6
  span
    +gradient-text($theme-gradient)
  .icon
    color: #4facfe
    margin-right: .5rem
  margin-bottom: .5rem
  font-weight: bold

.copyed-block
  +flex-center
  position: absolute
  width: 100%
  bottom: -2rem
  left: 0

.copyed-text
  position: relative
  text-align: center
  color: white
  font-size: .8rem
  font-weight: bold
  background: #333
  border-radius: 10px
  padding: .1rem .5rem
  .icon
    color: #4facfe
    margin-right: .4rem
  &:before
    position: absolute
    content: ''
    width: 0
    height: 100%
    border: solid transparent 5px
    border-bottom-color: #333
    top: -100%
    left: 50%
    transform: translateX(-50%)

</style>
