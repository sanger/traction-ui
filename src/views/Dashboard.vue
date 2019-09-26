<template>
  <b-row>
    <b-col>
      <div class="pipeline saphyr">
        <router-link :to="{ path: '/saphyr' }" tag="a">
          <h4>Saphyr</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </router-link>
      </div>
    </b-col>
    <b-col>
      <div class="pipeline pacbio">
        <router-link :to="{ path: '/pacbio' }" tag="a">
          <h4>Pacbio</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </router-link>
      </div>
    </b-col>
  </b-row>
</template>

<script>
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
  },
  computed: {
  }
}
</script>

<style lang="scss">
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
