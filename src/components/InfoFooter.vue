<template>
  <div id="footer">
    <br />
    <b-row class="justify-content-md-center">
      <b-col col lg="3">
        <b-row>
          <b-link href="https://www.sanger.ac.uk/">Wellcome Sanger Institute</b-link>
        </b-row>
        <b-row>
          <b-link href="https://www.sanger.ac.uk/science/groups/production-software-development">
            LIMS and Informatics team
          </b-link>
        </b-row>
      </b-col>
      <b-col col lg="3">
        <b-row>Traction [{{ environment }}]</b-row>
        <b-row>
          <b-link :href="repo">
            {{ getRelease() }}
          </b-link>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'InfoFooter',
  data() {
    return {
      environment: process.env.NODE_ENV,
      repo: '',
      linkSlice: 51, //length needed for to slice github URL down to release name
    }
  },
  created() {
    this.provider()
  },
  methods: {
    getRelease() {
      if (this.environment != 'development') {
        return this.repo.slice(this.linkSlice, this.repo.length)
      } else {
        return 'Releases'
      }
    },
    async provider() {
      if (this.environment != 'development') {
        try {
          await fetch('REPO')
            .then((response) => response.text())
            .then((response1) => {
              this.repo = response1
            })
        } catch (err) {
          console.error(err)
        }
      } else {
        this.repo = 'https://github.com/sanger/traction-ui/releases'
      }
    },
  },
}
</script>
<style scoped>
#footer {
  padding-bottom: 20px;
}
</style>
