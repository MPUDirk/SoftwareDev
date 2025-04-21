<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import router from "../../router";


const instance = getCurrentInstance();
const name = useRoute().params.name;
const quality = ref(0);
let csrfmiddlewaretoken = '';

onMounted(() => {
  instance.proxy.$axios.get(`goods/${name}/edit/`).then(response => {
    quality.value = response.data['quality'];
    csrfmiddlewaretoken = response.data['csrfmiddlewaretoken'];
  })
})

function submitChange() {
  const form = document.getElementById("update-form");
  const formData = new FormData(form);

  formData.set("csrfmiddlewaretoken", csrfmiddlewaretoken);

  instance.proxy.$axios.post(`goods/${name}/edit/`, formData).then(response => {
    router.push({name: 'goods-index'})
  });
}
</script>

<template>
 <h3>Edit {{name}}</h3>

  <form id="update-form" method="POST">
    <label for="quality" class="form-label">Quality</label>
    <input type="number" name="quality" id="quality" :value="quality" class="mb-3 form-control">

    <div class="float-end">
      <input type="button" @click="router.push({name: 'goods-index'})" value="Cancel" class="me-2 btn btn-outline-dark">
      <input type="button" @click="submitChange" value="Change" class="btn btn-dark">
    </div>
  </form>
</template>
