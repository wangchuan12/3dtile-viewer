<script setup>
import { onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import run from './three-render/main'
onMounted(()=>{
  run()
})
</script>

<template>
  <div id="three-con"></div>
</template>

<style scoped >

</style>
