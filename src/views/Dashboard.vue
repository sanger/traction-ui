<template>
  <b-row>
    <b-col>
      <div class="pipeline saphyr">
        <router-link :to="{ path: '/saphyr' }" tag="a">
          <h4>Saphyr</h4>
        </router-link>
        <pipeline-router pipeline="saphyr"></pipeline-router>
      </div>
    </b-col>
    <b-col>
      <div class="pipeline pacbio">
        <router-link :to="{ path: '/pacbio' }" tag="a">
          <h4>Pacbio</h4>
        </router-link>
        <pipeline-router pipeline="pacbio"></pipeline-router>
      </div>
    </b-col>
  </b-row>
</template>

<script>

import PipelineRouter from '@/components/PipelineRouter'

export default {
  name: 'Dashboard',
  props: {
  },
  data () {
    return {}
  },
  methods: {
  },
  components: {
    PipelineRouter
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
  .pipeline {
    height: 400px;
    padding: 20px;
    border: 2px solid gray;
    a {
      color: black;
      &:hover {
        text-decoration: none;
      }
    }
  }
  h4, p {
    text-align: left;
  }
</style>
