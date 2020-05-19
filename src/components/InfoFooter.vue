<template>
    <div id="footer">
        <br>
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
            <b-row>Traction [{{ this.environment }}]</b-row>
            <b-row>
              <b-link :href="this.repo">
                {{ getRelease() }}
              </b-link>
            </b-row>
          </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
  name: 'infoFooter',
  data() {
    return {
        environment: process.env.NODE_ENV,
        repo: ""
      }
  },
  methods: {
    getRelease() {
      if (this.environment != 'development') {
        return this.repo.slice(51, this.repo.length)
      } else {
        return this.repo.slice(38, this.repo.length)
      }
    },
    provider() {
      if (this.environment != 'development') {
        Promise.all([
          fetch('REPO').then(response => response.text())
        ]).then(([response1]) => {
          this.repo = response1
        }).catch(err => console.error(err))
      } else {
        this.repo = "https://github.com/sanger/traction-ui/releases"
      }
    }
  },
  created() {
    this.provider();
  }
}
</script>
