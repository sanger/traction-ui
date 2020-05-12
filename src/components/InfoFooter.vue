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
            <b-row>{{ this.release }}</b-row>
            <b-row>
              <b-link :href="this.repo">
                {{ this.repo.slice(38, this.repo.length) }}
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
        release: "",
        repo: ""
      }
  },
  methods: {
    provider() {
      if (this.environment != 'development') {
        Promise.all([
          fetch('RELEASE').then(response => response.text()),
          fetch('REPO').then(response => response.text())
        ]).then(([response1,response2]) => {
          this.release = response1;
          this.repo = response2;
        }).catch(err => console.error(err));
      } else {
        this.release = "Local Version"
        this.repo = "https://github.com/sanger/traction-ui/releases"
      }
    }
  },
  created() {
    this.provider();
  }
}
</script>
