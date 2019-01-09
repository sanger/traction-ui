import Query from '@/mixins/Query'

export default {
  name: 'DataModel',
  mixins: [Query],
  props: {
  },
  methods: {
    create(data) {
      return this.execute('post', this.resource, data)
    },
    update(id, data) {
      return this.execute('patch',`${this.resource}/${id}`, data)
    },
    find(id) {
      return this.execute('get', `${this.resource}/${id}`)
    },
    destroy(id) {
      return this.execute('delete', `${this.resource}/${id}`);
    },
  },
  render () {
  }
}
