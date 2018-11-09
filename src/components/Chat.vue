<template lang="pug">
#chat
  ul(ref='chatList')
    transition-group(name='chat-item')
      li(v-for='i in chatList' :key='i.key' :title='convertDate(i.date)')
        div(v-if='i.player')
          b [{{ i.player.name }}]
          span.content  {{ i.content }}
          span.time {{ convertDate(i.date, true) }}
        .info(v-else) {{ i.content }}
  .input-area
    span.icon #[i.fas.fa-comment-alt]
    input(type='text' v-model.trim='chatInputText' @keyup.enter='enter(roomId, chatInputText, fingerprint)' placeholder='' maxlength='100')
  .shortcut(title='點擊發送短語，快速地問候對方和他媽媽')
    a.word(href='#' v-for='i in words' @click.prevent.stop='debouncedSendChat(roomId, i, fingerprint)') {{ i }}
</template>

<script>
import db from '@/assets/js/db'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Chat',
  data () {
    return {
      childName: `chat`,
      chat: null,
      chatInputText: ``,
      words: [`你好`, `GG`, `謝謝`, `掰哺`, `快一點`, `手滑了`, `幹🖕`, `女束攵`]
    }
  },
  props: {
    roomId: {
      type: String,
      default: null,
    },
    fingerprint: {
      type: String,
      default: null,
    }
  },
  created () {
    // this.debouncedEnter = _.debounce(this.enter, 500, { leading: true, trailing: false })
    this.debouncedSendChat = _.debounce(this.sendChat, 500, { leading: true, trailing: false })
  },
  mounted() {
    if (this.roomId)
      db.onRoom(this.roomId, this.childName, (data) => this[this.childName] = data)
  },
  methods: {
    enter () {
      if(this.chatInputText !== ``)
        this.sendChat(this.roomId, this.chatInputText, this.fingerprint)
      this.chatInputText = ``
    },
    sendChat (id, content, fingerprint) {
      db.sendChat(id, content, fingerprint)
    },
    convertDate (x, isFromNow = false) {
      if (isFromNow) return moment(x).fromNow()
      return moment(x).format(`YYYY/MM/DD HH:mm:ss`)
    },
  },
  beforeDestroy () {
    db.offRoom(this.roomId, this.childName)
  },
  computed: {
    chatList () {
      const chat = Object.assign({}, this.chat)
      const result = _(chat)
        .map((v, k) => _.merge({}, v, { key: k }))
        .sortBy('date')
        .value()
      return _.orderBy(result, `date`)
    }
  },
  watch: {
    chat () {
      this.$nextTick(() => {
        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight + 50
     })
    }
  },
}
</script>

<style scoped lang="sass">
@import "../assets/css/chat"
</style>
