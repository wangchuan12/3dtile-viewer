<script setup>
import { MathUtils } from 'three';
import {onMounted, ref ,onUnmounted} from 'vue';

const data = defineProps({
    initLeft : String,
    initTop : String
})

const emit = defineEmits(["mini" , "close"])
const left = ref(data.initLeft)
const top = ref(data.initTop)
const id = MathUtils.generateUUID()
let isClick = false
const offset = {
    x : 0,
    y : 0
}
const pointerdown = (e)=>{
    console.log(e)
    if (e.srcElement.id !== id) return
    isClick = true
    offset.x = e.offsetX
    offset.y = e.offsetY
}

const pointerup = (e)=>{
    isClick = false
    offset.x = 0
    offset.y = 0
    console.log(e)
}

const pointermove = (e)=>{
    if (!isClick) return
    left.value = e.clientX - offset.x + "px"
    top.value = e.clientY - offset.y + "px"
}

const mini = ()=>{
    emit("mini")
    show.value = !show.value
}

const close = ()=>{
    emit("close")
}

const show = ref(true)

onMounted(()=>{
    document.addEventListener("pointermove" , pointermove)
})

onUnmounted(()=>{
    document.removeEventListener("pointermove" , pointermove)
})

</script>
<template>
    <div class="move-box-con" >
        <div class="move-head" @pointerdown="pointerdown" @pointerup.stop="pointerup" :id="id">
            <div class="mini" @click="mini">
                <svg t="1690380548262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3071" width="20" height="20"><path d="M473.17987 589.960954c0-27.571686-22.817947-38.614988-48.707541-38.614987H41.759769c-21.940334 0-39.200063 17.332864-39.200063 39.419466 0 21.940334 17.259729 39.346332 39.200063 39.346333h297.218391l-327.78859 329.10501a37.66424 37.66424 0 0 0 0 53.534415 37.298568 37.298568 0 0 0 53.315012 0l330.202027-331.518447v303.142281c0 22.013468 17.259729 39.346332 39.200063 39.346333 21.940334 0 39.200063-17.332864 39.200064-39.346333V589.960954z m509.747093-196.000317H684.904093l327.78859-329.10501a37.66424 37.66424 0 0 0 0-53.607549 37.298568 37.298568 0 0 0-53.315011 0L629.980124 342.766525V39.551109a39.419467 39.419467 0 0 0-39.200064-39.346333c-21.940334 0-39.200063 17.332864-39.200063 39.346333v393.609592c0 0.804479 0.731344 1.608958 0.731344 2.413437 0 10.238823 3.144781 20.477645 10.970167 27.571686 9.507478 10.238823 23.549292 13.383604 36.128417 9.434344h382.712559c21.940334 0 39.200063-17.332864 39.200064-39.419467a38.249316 38.249316 0 0 0-38.395585-39.346333z"  p-id="3072"></path></svg>
            </div>
            <div class="close" @click="close">
                <svg t="1690380753051" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4869" width="200" height="200"><path d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"  p-id="4870"></path></svg>
            </div>
            
        
        </div>
        <slot v-if="show">
        </slot>
    </div>
</template>
<style scoped>
.move-box-con{
    position: fixed;
    left: v-bind(left);
    top : v-bind(top);

}

.move-head{
    height: 30px;
    /* background-color: rgba(240, 248, 255, 0.74); */
    cursor: move;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.mini,.close{
    margin-left: 10px;
}

.icon{
    width: 100%;
    height: 20;
    height: 100%;
    padding: 0;
    margin: 0px;
    cursor: pointer;
    fill: white;
}
</style>