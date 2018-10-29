export const profile = {
  data () {
    return {
      name: ``,
      fingerprint: null,
      profile: null,
    }
  },
  methods: {
    goToIndex () {
      this.$router.push({ name: 'Index' })
    }
  },
}
