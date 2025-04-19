<script setup>
import { RouterView } from 'vue-router'
import {getCurrentInstance, onMounted, ref} from "vue";
import router from "./router";


const instance = getCurrentInstance()
const user = ref(JSON.parse(localStorage.getItem('user')) || {isAuthenticated: false})
const perms = ref([])

onMounted(() => {
  if (user.value.isAuthenticated) {
    instance.proxy.$axios.get("user/perms/").then(response => {
      perms.value = response.data['perms'];
    }).catch(e => {
      console.error(e);
    })
  }
})

function clickLockout() {
  instance.proxy.$axios.get("user/logout/").then(() => {
    user.value = {isAuthenticated: false};
    perms.value = [];
    localStorage.removeItem('user');
    router.push('/')
  }).catch(e => {
    console.error(e);
  })
}

function setUser(u) {
  user.value = u;
}

function setPerms(p) {
  perms.value = p;
}
</script>

<template>
  <div class="row">
    <div class="col-auto list-group list-group-flush">
      <RouterLink
        to="/"
        class="list-group-item list-group-item-action list-group-item-dark"
      >Home</RouterLink>

<!--      <RouterLink-->
<!--        to="/orders"-->
<!--        v-if="perms === '__customer__'"-->
<!--        class="list-group-item list-group-item-action list-group-item-dark"-->
<!--      >Order</RouterLink>-->

<!--      <RouterLink-->
<!--        to="/goods"-->
<!--        v-if="perms === '__staff__' || perms === '__super__'"-->
<!--        class="list-group-item list-group-item-action list-group-item-dark"-->
<!--      >Goods Manage</RouterLink>-->

      <RouterLink
        to="/staff"
        v-if="perms === '__super__'"
        class="list-group-item list-group-item-action list-group-item-dark"
      >Staff Manage</RouterLink>

      <button
        class="list-group-item list-group-item-action list-group-item-dark"
        v-if="user.isAuthenticated"
        @click="clickLockout"
      >Logout</button>
    </div>

    <main class="ps-2 pt-3 col me-3">
      <RouterView
          :user="user"
          @set-user="setUser"
          @set-perms="setPerms"
      />
    </main>
  </div>
</template>
