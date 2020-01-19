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
  async mounted () {
    this.fingerprint = await fingerprint.get()
    this.profile = await db.getPlayer(this.fingerprint)

    if (this.profile) this.goToIndex()
  },
  methods: {
    async confirm () {
      await db.setPlayer(this.fingerprint, this.name)
      this.goToIndex()
    },
    goToIndex () {
      if (this.$route.query.roomId)
        this.$router.push({ name: 'Room', params: { id: this.$route.query.roomId } })
      else
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
</style>
