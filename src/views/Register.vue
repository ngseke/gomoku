<template lang="pug">
main
  .container
    .row.justify-content-center.align-items-center.mt-5
      .col-12.col-md-6.col-lg-4
        Nickname(v-model.trim='name' @confirm='f' :isFirst='true')
      .col-12 {{name}}
</template>

<script>
import Nickname from '@/components/Nickname.vue'

export default {
  name: 'Index',
  data () {
    return {
      name: ``
    }
  },
  methods: {
    f () {
      console.log(this.name)
    }
  },
  components: {
    Nickname
  }
}
</script>

<style scoped lang="sass">

</style>
