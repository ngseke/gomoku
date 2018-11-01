<template lang='pug'>
#app
  router-view(:key="$route.path")
</template>

<script>
import db from '@/assets/js/db'
import fingerprint from '@/assets/js/fingerprint'

export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
}
</script>

<style lang="sass">

</style>
