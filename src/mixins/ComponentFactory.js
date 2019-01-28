import Vue from 'vue'

export default {
  name: 'ComponentFactory',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    build(component, props = {}) {
      let Cmp = Vue.extend(component)
      return new Cmp({ propsData: props})
    }
  }
}
