<script setup>
import {getCurrentInstance, ref} from "vue";
import {Modal} from "bootstrap";


const instance = getCurrentInstance();
let modal = null;
const goods = ref([]);

function clickAdd() {
  const form = document.getElementById("newStaffForm");
  const formData = new FormData(form);

  instance.proxy.$axios.get("/goods/new/").then(response => {
    formData.set("csrfmiddlewaretoken", response.data);

    instance.proxy.$axios.post("/goods/new/", formData).then(respond => {
      const good = {
        'good': `${formData.get("name")} * ${formData.get("quality")}`,
        'name': formData.get("name"),
      }
      goods.value.push(good);
      Modal.getInstance('#newGoodsModal').hide();
    }).catch(error => {
      console.log(error);
    });
  });
}

function clickAddGood() {
  modal = new Modal('#newGoodsModal');
  modal.show()
}
</script>

<template>
  <div class="modal fade" id="newGoodsModal" aria-labelledby="newGoodsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newGoodsModalLabel">Modal title</h1>
        </div>

        <form id="newStaffForm" action="/goods/new/" method="POST">
          <div class="modal-body">
            <label for="group">Group:</label>
            <input id="group" type="text" name="group" list="groupOptions" class="form-control">

            <label for="name">Name:</label>
            <input id="name" type="text" name="name" class="form-control">

            <label for="quality">Quantity:</label>
            <input id="quality" type="text" name="quality" class="form-control">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" @click="modal.hide">Close</button>
            <button type="button" @click="clickAdd" class="btn btn-dark">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="border-bottom d-flex align-items-center justify-content-between">
    <h1>Goods Management</h1>
    <button type="button" class="btn btn-dark" @click="clickAddGood">
      + Goods
    </button>
  </div>

  <RouterView v-model="goods"/>
</template>
