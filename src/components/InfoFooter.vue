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
                A tool from LIMS and Informatics
              </b-link>
            </b-row>
          </b-col>
          <b-col col lg="3">
            <b-row>Traction [{{ $data.environment }}]</b-row>
            <b-row>{{ $data.host_name }}</b-row>
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
        host_name: location.hostname
      }
  }
}
</script>
