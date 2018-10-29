<template lang="pug">
main
  Logo
  .container
    .row.justify-content-center.align-items-center.mt-3
      .col-12.col-md-6.col-lg-4(v-if='fingerprint')
        Nickname(v-model.trim='name' @confirm='confirm' :isFirst='true')
      .col-12.loading(v-else)
        fa(icon='circle-notch' spin)
      .col-12
        .fingerprint {{ fingerprint }}
</template>

<script>
import Nickname from '@/components/Nickname.vue'
import Logo from '@/components/Logo.vue'

import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'

export default {
  name: 'Register',
  data () {
    return {
      name: ``,
      fingerprint: null,
      player: null,
    }
  },
  mounted() {
    fingerprint.get()
      .then(fingerprint => {
        this.fingerprint = fingerprint
        return db.getPlayer(fingerprint)
      })
      .then(player => {
        this.player = player
        // if (player && this.isFirst) this.backToIndex()
      })
  },
  methods: {
    confirm () {
      db.setNewPlayer(this.fingerprint, this.name)
        .then(() => this.backToIndex())
    },
    backToIndex () {
      this.$router.push({ name: 'Index' })
    }
  },
  components: {
    Nickname,
    Logo
  }
}
</script>

<style scoped lang="sass">
.fingerprint
  color: $gray-500
  font-size: .8rem
  text-align: center

.loading
  text-align: center
</style>
