<script setup>
import { onMounted, ref } from 'vue';
import run from './three-render/main'
import Table from './components/Table.vue';
let threeMain;
const featureTable = ref({
  header : ["a" , "b" , "c"],
  data : {
    "a" : [1 ,2 ,3],
    "b" : [4 , 5 , 6],
    "c" : [7 , 8  ,9]
  },
  length : 3,
  name : "featureTable",
  show : false
})

const batchTable = ref({
  header : ["a" , "b" , "c"],
  data : {
    "a" : [1 ,2 ,3],
    "b" : [4 , 5 , 6],
    "c" : [7 , 8  ,9]
  },
  length : 3,
  name : "featureTable",
  show : false
})
onMounted(()=>{
  threeMain = run()
  threeMain.viewer.eventBus.on("modeLoad" , (data)=>{
    console.log(data)
    if (data.featureTable) {
      featureTable.value = data.featureTable
    } else {
      featureTable.value.show = false
    }
    if (data.batchTable) {
      batchTable.value = data.batchTable
    } else {
      batchTable.value.show = false
    }
  })
})
</script>

<template>
  <Table :headers="featureTable.header" :data="featureTable.data" :length="featureTable.length" :name="featureTable.name" v-if="featureTable.show" :init-left="'10px'" :init-top="'50px'"></Table>
  <Table :headers="batchTable.header" :data="batchTable.data" :length="batchTable.length" :name="batchTable.name" v-if="batchTable.show" :init-left="'10px'" :init-top="'290px'"></Table>
  <div id="three-con"></div>
</template>

<style scoped >

</style>
