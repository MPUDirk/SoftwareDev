<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";


defineEmits(['set-user', 'set-perms'])
const props = defineProps(['user', 'perms'])
const instance = getCurrentInstance();
const orders = ref([]);
const range = ref([]);
const page_obj = ref({});

function changePage(page='') {
  instance.proxy.$axios.get(`${page}`).then(response => {
    orders.value = response.data['orders'];
    range.value= response.data['page_range'];
    page_obj.value = response.data['page_obj'];
    console.log(range.value)
  }).catch(e => {
    console.error(e);
  })
}

onMounted(() => {
  changePage();
})

function cancelOrder(order_id) {
  instance.proxy.$axios.get(`order/${order_id}/del/`).then(response => {
    changePage();
  })
}

function doneOrder(order_id) {
  instance.proxy.$axios.get(`order/${order_id}/done/`).then(response => {
    changePage();
  })
}
</script>

<template>
  <div class="w-50">
    <ul class="my-3 list-group">
      <li v-for="order in orders" class="list-group-item d-flex align-items-center justify-content-between">
        {{order.order}}
        <div v-if="props.perms === '__customer__'">
          <button @click="cancelOrder(order.id)" class="btn btn-sm btn-danger float-end" type="button">Cancel</button>
        </div>
        <div v-if="props.perms === '__staff__' || props.perms === '__super__'">
          <button @click="doneOrder(order.id)" class="btn btn-sm btn-success float-end" type="button">Done</button>
        </div>
      </li>
      <li v-if="orders.length === 0" class="list-group-item">
        No any Order
      </li>
    </ul>

    <div class="d-flex justify-content-center">
      <div class="btn-group">
        <div v-if="page_obj['previous_page_number']">
          <button @click="changePage(`?page=${page_obj['previous_page_number']}`)" class="btn btn-outline-dark"><</button>
        </div>

        <div v-for="page in range">
          <div v-if="page === page_obj['number']">
            <button class="btn btn-dark disabled">{{page}}</button>
          </div>
          <div v-else>
            <button @click="changePage(`?page=${page}`)" class="btn btn-outline-dark">{{page}}</button>
          </div>
        </div>

        <div v-if="page_obj['next_page_number']">
          <button @click="changePage(`?page=${page_obj['next_page_number']}`)" class="btn btn-outline-dark">></button>
        </div>
      </div>
    </div>
  </div>
</template>
