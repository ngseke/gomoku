<template lang="pug">
main
  .container
    .row.align-items-center.justify-content-center
      .logo.col-12.col-md-3.mb-3.mb-md-0
        h1
          .back-btn
            a(href='#' @click='back()'): fa(icon='angle-left')
          img(:src='logoImg')
          span Gomoku
      .info.col-12.col-md-7
        p #[b Gomoku] 是無禁手的五子棋遊戲，分享房間連結即可和好友線上對弈。
        p 雙方分別使用黑白兩色的棋子，輪流下在棋盤直線與橫線的交叉點上，先在橫線、直線或斜對角線上形成 5 子連線者獲勝。
        //- .flow
          .step 新增房間或輸入 ID 加入現有房間
          .step.right 廝殺
          .step 結束
        p
          span By Huang Xingqiao
          a(href='https://github.com/a92304a92304/tic-tac-toe' target='_blank'): fa(:icon='[`fab`, `github-alt`]')
          a(href='mailto:a92304a92304@gmail.com' target='_blank'): fa(icon='envelope')
          a(href='https://x-q.me' target='_blank'): fa(icon='home')
</template>

<script>
import Logo from '@/components/Logo.vue'

export default {
  name: 'About',
  data () {
    return {
      logoImg: require('@/assets/icon.png')
    }
  },
  mounted () {
  },
  methods: {
    back () {
      this.$router.push({ name: `Index` })
    },
  },
  components: {
    Logo,
  },

}
</script>

<style scoped lang="sass">
@keyframes bounce-in
  from
    opacity: 0
    transform: scale(.95)
  to

@keyframes down-in
  from
    opacity: 0
    transform: translateY(-.5rem)
  to

.logo
  h1
    animation: bounce-in .4s ease .4s backwards
.info
  p
    &:nth-child(1)
      animation: down-in .4s ease .6s backwards
    &:nth-child(2)
      animation: down-in .4s ease .8s backwards
    &:nth-child(3)
      animation: down-in .4s ease 1s backwards

main
  +flex-center
  position: absolute
  height: 100%
  width: 100%
  background: $background
  .container
    animation: in .4s ease backwards

h1
  +flex-center
  width: auto
  flex-direction: column
  position: relative
  font-weight: 900
  font-size: 2rem
  span
    +gradient-text(linear-gradient(25deg, black 0%, rgba(#434343, .7) 100%))
    letter-spacing: -.1rem
  img
    width: auto
    height: 5rem

.back-btn
  border-radius: 10px
  position: absolute
  top: 0
  left: 0
  height: 100%
  a
    font-size: 2rem
    color: $gray-500
    transition: color .2s
  &:hover a
    color: $gray-600

p
  line-height: 2rem
  a, span
    color: $gray-500
    margin-right: .25rem
    font-size: .8rem
  span
    margin-right: .4rem

.flow
  display: flex
  flex-direction: column
  align-items: flex-start
  max-width: 30rem
  counter-reset: section
  +mx(auto)
  .step
    +block-border
    padding: 1rem 1rem 1rem 2.25rem
    position: relative
    margin-bottom: .5rem
    &::before
      position: absolute
      display: inline-block
      padding: 0
      counter-increment: section
      content: counter(section)
      top: .3rem
      left: .6rem
      font-size: 2rem
      line-height: 2rem
      color: $gray-400
    &.right
      align-self: flex-end
</style>
