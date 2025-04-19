<script setup>
import { RouterView } from 'vue-router'
import {getCurrentInstance, onMounted, ref} from "vue";


const instance = getCurrentInstance()
const csrfmiddlewaretoken = ref('')
const user = ref(JSON.parse(localStorage.getItem('user')) || {isAuthenticated: false})
const perms = ref([])

onMounted(() => {
  instance.proxy.$axios.get("").then(response => {
    const form_data = new FormData();

    csrfmiddlewaretoken.value = response.data['csrfmiddlewaretoken'];
    form_data.append('csrfmiddlewaretoken', csrfmiddlewaretoken.value);
    form_data.append('username', user.value.username);

    if (user.value.isAuthenticated) {
      instance.proxy.$axios.get("user/perms/").then(response => {
        perms.value = response.data['perms'];
      }).catch(e => {
        console.error(e);
      })
    }
  }).catch(e => {
    console.error(e);
  })
})

function clickLockout() {
  instance.proxy.$axios.get("user/logout/").then(() => {
    user.value = {isAuthenticated: false};
    perms.value = [];
    localStorage.removeItem('user');
  }).catch(e => {
    console.error(e);
  })
}

function setCsrfmiddlewaretoken(token) {
  csrfmiddlewaretoken.value = token;
  console.log(csrfmiddlewaretoken.value);
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
      <RouterLink
        to="/staff"
        v-if="perms === '__super__'"
        class="list-group-item list-group-item-action list-group-item-dark"
      >Staff Manage</RouterLink>
      <a
          href="#"
          class="list-group-item list-group-item-action list-group-item-dark"
          v-if="user.isAuthenticated"
          @click="clickLockout"
      >Logout</a>
    </div>

    <main class="ps-2 pt-3 col me-3">
      <RouterView
          :csrfmiddlewaretoken="csrfmiddlewaretoken"
          :user="user"
          @set-csrfmiddlewaretoken="setCsrfmiddlewaretoken"
          @set-user="setUser"
          @set-perms="setPerms"
      />
    </main>
  </div>
</template>
