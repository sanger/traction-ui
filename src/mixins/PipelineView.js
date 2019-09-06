import PipelineRouter from '@/components/PipelineRouter'

/*
  Creates a pipeline page which should be standard
  It will generate a template with a class, title and the routes
*/
export default {
  name: 'PipelineView',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    pipeline () {
      return this.$options.name.toLowerCase()
    }
  },
  components: {
    PipelineRouter
  },
  methods: {
  },
  render (createElement) {
    return createElement(
      'div', 
      { class: this.pipeline },
      [
        createElement('pipeline-router', { props: { pipeline: this.pipeline, routes: this.routes }}),
        createElement('h4', this.$options.name),
        createElement('router-view')
      ]
    )
  }
}
