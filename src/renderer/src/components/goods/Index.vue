<script setup>
import {getCurrentInstance, onMounted} from "vue";
import router from "../../router";


const model = defineModel()
const instance = getCurrentInstance();

onMounted(() => {
  instance.proxy.$axios.get("goods/").then(response => {
    model.value = response.data.goods;
  })
})

function clickDel(good) {
  instance.proxy.$axios.get(`goods/${good['name']}/del/`).then(response => {
    model.value = model.value.filter(item => item['name'] !== good['name']);
  })
}
</script>

<template>
  <ul class="list-group">
    <li v-for="good in model" class="list-group-item d-flex align-items-center justify-content-between">
      {{ good['good'] }}
      <div>
        <button @click="router.push({name: 'goods-edit', params: {name: good['name']}})" type="button" class="me-2 btn btn-sm btn-success">Edit</button>
        <button @click="clickDel(good)" type="button" class="btn btn-sm btn-danger">Delete</button>
      </div>
    </li>
    <li v-if="model.length === 0" class="list-group-item">
      No Goods
    </li>
  </ul>
</template>
