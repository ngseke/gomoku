<template lang="pug">
#chat
  ul(ref='chatList')
    transition-group(name='chat-item')
      li(v-for='i in chatList' :key='i.key' :title='convertDate(i.date)')
        div(v-if='i.player')
          b [{{ i.player.name }}]
          span.content  {{ i.content }}
          //- span.time {{ convertDate(i.date, true) }}
        .info(v-else)
          |  {{ i.content }}
  .input-area
    span.icon #[i.fas.fa-comment-alt]
    input(type='text' v-model.trim='chatInputText' @keyup.enter='enter(roomId, chatInputText, fingerprint)' placeholder='' max='100')
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
  mounted() {
    if (this.roomId)
      db.onRoom(this.roomId, this.childName, (data) => this[this.childName] = data)
    else {
    }
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
    console.log(`beforeDestroy ${this.childName}`)
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
        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
     })
    }
  },
}
</script>

<style scoped lang="sass">
@import "../assets/css/chat"
</style>
