<template lang="pug">
#logo
  h1 Xiaqi
</template>

<script>
export default {
  name: 'Logo',
}
</script>

<style scoped lang="sass">
#logo
  +flex-center
  +my(1rem)

h1
  display: inline-block
  color: $yellow
  color: $black
  font-weight: 900
  text-transform: uppercase
</style>
