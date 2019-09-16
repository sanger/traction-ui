<template>
    <div class="dashboard">
      <div class="pipeline saphyr">
         <router-link :to="{ path: '/saphyr' }" tag="a">
          <h4>Saphyr</h4>
          <div class="description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </router-link>
      </div>
      <div class="pipeline pacbio">
        <router-link :to="{ path: '/pacbio' }" tag="a">
          <h4>Pacbio</h4>
          <div class="description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </router-link>
      </div>
    </div>
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
  .dashboard {
    width: 90%;
    text-align: center;
  }
  .pipeline {
    width: 500px;
    height: 400px;
    padding: 20px;
    border: 2px solid gray;
    display: inline-block;
    margin: 20px;
    a {
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      &:hover {
        text-decoration: none;
      }
    }
 }
 h4, .description {
  text-align: left;
 }
 h4 {
  &:hover {
    text-decoration: underline;
  }
  .description {
    display: block;
    width: 100%;
    height: 100%;
  }

 }
</style>
