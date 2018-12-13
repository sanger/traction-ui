
import Query from '@/mixins/Query'

export default {
  name: 'DataModel',
  mixins: [Query],
  props: {
  },
  methods: {
    create(data) {
      return this.execute('post', this.endpoint, data)
    },
    update(data) {
      return this.execute('patch', this.endpoint, data)
    }

  },
  render () {
  }
}