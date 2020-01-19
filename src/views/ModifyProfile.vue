<template lang="pug">
main
  Logo
  .container
    .row.justify-content-center.align-items-center.mt-3
      .col-12.col-md-6.col-lg-5.col-xl-4(v-if='fingerprint && profile')
        Nickname(v-model.trim='name' @confirm='confirm' @cancel='goToIndex()' :isFirst='false')
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
  name: 'ModifyProfile',
  async mounted () {
    this.fingerprint = await fingerprint.get()
    this.profile = await db.getPlayer(this.fingerprint)
    
    if (!this.profile) {
      return this.goToIndex()
    }
    this.name = this.profile.name
  },
  methods: {
    async confirm () {
      await db.setPlayer(this.fingerprint, this.name, false)
      this.goToIndex()
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
.loader
  text-align: center
</style>
