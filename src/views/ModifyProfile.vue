<template lang="pug">
main
  Logo
  .container
    .row.justify-content-center.align-items-center.mt-3
      .col-12.col-md-6.col-lg-4(v-if='fingerprint && profile')
        Nickname(v-model.trim='name' @confirm='confirm' @cancel='goToIndex()' :isFirst='false')
      .col-12.loading(v-else)
        fa(icon='circle-notch' spin)
      //- .col-12
        .fingerprint {{ fingerprint }}
</template>

<script>
import Nickname from '@/components/Nickname.vue'
import Logo from '@/components/Logo.vue'
import { profile } from '@/mixins/profile'

import fingerprint from '@/assets/js/fingerprint'
import db from '@/assets/js/db'

export default {
  name: 'ModifyProfile',
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
        if (!profile) this.goToIndex()
        this.profile = profile
        this.name = profile.name
      })
  },
  methods: {
    confirm () {
      db.setPlayer(this.fingerprint, this.name, false)
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

.loading
  text-align: center
</style>
