<script setup>
import { ref } from 'vue';
import MoveBox from './MoveBox.vue'
const props = defineProps({
    headers : [],
    data : Object,
    length : Number,
    name : String,
    initLeft : String,
    initTop : String
})
console.log(props.headers , props.data , props.length)
</script>
<template>
    <MoveBox :init-left="initLeft" :init-top="initTop">
        <div class = "table">
            <h1 class="table-name">{{name}}</h1>
            <div class="header">
                <div class="header-item"  v-for="(item , index) in headers">
                    {{ item }}
                </div>
            </div>
            <div class="body">
                <div class="row" v-for="index in length">
                    <div class="body-row-item" v-for="item in headers">
                        {{data[item][index - 1] }}
                    </div>
                </div>
            </div>
        </div>
    </MoveBox>
</template>
<style scoped>
.table{
    display: flex;
    flex-direction: column;
    color: white;
    --item-width : 240px;
    --item-height : 30px;
    justify-content: center;
    align-items: center;
    list-style: var(--item-height);
    
}

.header{
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid white;
    /* height: 100px; */
}

.header , .body , .row{
    justify-content :space-around;
    align-items :center;
    width: 100%;
    overflow-wrap: break-word;
}

.body{
    display: flex;
    flex-direction: column;
    min-width: 500px;
    min-height: 100px;
}
.body-row-item , .header-item{
    width: var(--item-width);
    height: var(--item-height);
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-right: 1px solid white;
    text-align: center;
}

.body-row-item:last-child , .header-item:last-child{
    border-right: none;
}
.row {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid white;
    /* height: 100px; */
}
</style>