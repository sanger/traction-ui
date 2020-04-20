<template>
    <div>
        <br>
        <b-icon-server></b-icon-server>
        <b-form>
            <b-form-group :label="info.environment">
            </b-form-group>
            <b-form-group :label="info.host_name">
            </b-form-group>
        </b-form>
    </div>
</template>

<script>

export default {
  name: 'infoFooter',
  data() {
    return {
      info: {
        environment: process.env.NODE_ENV,
        host_name: location.hostname
      }
    }
  }
}
</script>
