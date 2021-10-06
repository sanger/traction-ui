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
      defaultRelease: 'https://github.com/sanger/traction-ui/releases',
    }
  },
  created() {
    this.provider()
  },
  methods: {
    getRelease() {
      if (this.repo != this.defaultRelease) {
        return this.repo.slice(this.linkSlice, this.repo.length)
      } else {
        return 'Releases'
      }
    },
    async provider() {
      try {
        await fetch('REPO')
          .then((response) => response.text())
          .then((response1) => {
            // Checks returned text contains REPO text as fetch returns index.html if REPO doesn't exist
            response1.includes('github.com/sanger/traction-ui/releases')
              ? (this.repo = response1)
              : (this.repo = this.defaultRelease)
          })
      } catch (err) {
        console.error(err)
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
