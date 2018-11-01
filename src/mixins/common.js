import moment from 'moment'

export const common = {
  data () {
    return {
      status: [``],
      isLoading: false,
      fingerprint: null,
      profile: null,
    }
  },
  methods: {
    convertDate (x, isFromNow = false) {
      if (isFromNow) return moment(x).fromNow()
      return moment(x).format(`YYYY/MM/DD HH:mm:ss`)
    },
  },
}
