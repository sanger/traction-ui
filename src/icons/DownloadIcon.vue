<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    viewBox="0 -960 960 960"
    :fill="color"
  >
    <path
      d="M220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Zm260-153L287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193Z"
    />
  </svg>
</template>

<script>
export default {
  name: 'DownloadIcon',
  props: {
    color: {
      type: String,
      default: '#fff',
    },
  },
}
</script>
