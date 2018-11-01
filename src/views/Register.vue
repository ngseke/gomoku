<template lang="pug">
main
  Logo
  .container
    .row.justify-content-center.align-items-center.mt-3
      .col-12.col-md-6.col-lg-5.col-xl-4(v-if='fingerprint')
        Nickname(v-model.trim='name' @confirm='confirm' :isFirst='true')
      .col-12.loader(v-else)
        fa(icon='circle-notch' spin)
</template>

<script>
import Nickname from '@/components/Nickname.vue'
import Logo from '@/components/Logo.vue'
import { profile } from '@/mixins/profile'

import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'

export default {
  name: 'Register',
  data () {
    return {
    }
  },
  mounted() {
    fingerprint.get()
      .then(fingerprint => {
        this.fingerprint = fingerprint
        return db.getPlayer(fingerprint)
      })
      .then(profile => {
        this.profile = profile
        if (profile) this.goToIndex()
      })
  },
  methods: {
    confirm () {
      db.setPlayer(this.fingerprint, this.name)
        .then(() => this.goToIndex())
    },
    goToIndex () {
      this.$router.push({ name: 'Index' })
    }
  },
  components: {
    Nickname,
    Logo
  },
  mixins: [profile]
}
</script>

<style scoped lang="sass">
.fingerprint
  color: $gray-500
  font-size: .8rem
  text-align: center
</style>
