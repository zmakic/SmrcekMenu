<template>
  <h1>TITLE JE: {{ title ? title : 'N/A' }}</h1>
</template>

<script>
  //export default
  export default {
    props: {
        title: String
    },
  }
</script>

<style scoped>
  p {
    font-size: 2em;
    text-align: center;
  }
</style>