<template lang="pug">
#logo
  h1 XIAQI
</template>

<script>
export default {
  name: 'Logo',
  props: {
  }
}
</script>

<style scoped lang="sass">
#logo
  +flex-center
  +my(1rem)
    
h1
  display: inline-block
  color: $yellow
</style>
