<script>
  // A component to build a nav bar for a particular pipeline
  export default {
    name: 'PipelineRouter',
    props: {
      pipeline: {
        type: String,
        required: true
      },
      routes: {
        type: Array,
        default: () => {
          return [
            'reception',
            'samples',
            'libraries',
            'runs'
          ]
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      titleise (s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
      }
    },
    mounted: function() {
      this.$store.commit('setPipeline', this.pipeline)
    },
    /*
      This is where the magic happens
      Takes an array of routes and turns them into an array of link elements
      Each route is namespaced with the pipeline
      The Dashboard element is injected at the start
      Each element is interspersed with a |
      e.g. [a,b,c] with pipelineA would become
      ['<a href="#/dashboard">Dashboard</a>', '<a href="#/pipelineA/a">A</a>', '<a href="#/pipelineA/b">B</a>', '<a href="#/pipelineA/c">C</a>']
    */
    render (createElement) {
      let self = this

      let elements = self.routes.reduce(
          (result, route) => {
            result.push(' | ')
            result.push(
              createElement(
                'router-link', {
                  props: {
                    to: `/${self.pipeline}/${route}`
                  }
                }, this.titleise(route)
              )
            )
            return result
          }, []
      )
      elements.unshift(createElement('router-link', {props: { to: '/dashboard'}}, 'Dashboard'))
      return createElement('nav', elements)
    }
  }
</script>

<style scoped lang="scss">
  nav {
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
    }
  }
}
</style>
