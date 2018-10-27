<template lang="pug">
main
  .container

    .row.justify-content-center.align-items-center.mt-5
      .col-12 {{a}}
      .col-4
        Nickname(v-model='a' )
</template>

<script>
import Nickname from '@/components/Nickname.vue'

export default {
  name: 'Index',
  data () {
    return {
      a: ``
    }
  },
  components: {
    Nickname
  }
}
</script>

<style scoped lang="sass">

</style>
