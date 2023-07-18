<script setup>
import {onMounted, ref ,onUnmounted} from 'vue';

const data = defineProps({
    initLeft : String,
    initTop : String
})
const left = ref(data.initLeft)
const top = ref(data.initTop)
let isClick = false
const offset = {
    x : 0,
    y : 0
}
const pointerdown = (e)=>{
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

onMounted(()=>{
    document.addEventListener("pointermove" , pointermove)
})

onUnmounted(()=>{
    document.removeEventListener("pointermove" , pointermove)
})

</script>
<template>
    <div class="move-box-con" @pointerdown.stop="pointerdown" @pointerup.stop="pointerup">
        <!-- <div class="move-head" @pointerdown="pointerdown" @pointerup="pointerup"></div> -->
        <slot>
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
    background-color: rgba(240, 248, 255, 0.74);
}
</style>