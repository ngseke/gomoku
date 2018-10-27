<template lang="pug">
.dialog
  h2 Nickname
  input(:value='name' @input=`$emit('input', $event.target.value)`)
  a.text-success.btn-confirm(href='#' @click.prevent='') V
</template>

<script>
export default {
  name: 'Nickname',
  data () {
    return {
      name: ``
    }
  }
}
</script>

<style scoped lang="sass">

</style>
