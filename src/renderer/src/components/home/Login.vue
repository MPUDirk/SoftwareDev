<script setup>
import Signup from "@/components/home/Signup.vue";
import ErrsMsg from "@/components/ErrsMsg.vue";
import {getCurrentInstance, ref} from "vue";


const emits = defineEmits(['switch-component', 'set-user', 'set-perms'])
const props = defineProps(['user'])
const instance = getCurrentInstance()
const errs = ref({})

function clickLogin() {
  const form = document.getElementById("login-form")
  const form_data = new FormData(form)
  const url = form.getAttribute("action");

  errs.value = {}

  instance.proxy.$axios.get(url).then(response => {
    form_data.set('csrfmiddlewaretoken', response.data)

    instance.proxy.$axios.post(url, form_data).then(response => {
      const data = response.data;
      const strUser = JSON.stringify(data['user']);

      emits('set-user', data['user'])
      emits('set-perms', data['perms'])
      localStorage.setItem('user', strUser);
    }).catch(e => {
      try {
        const errors = e.response.data['errors']

        for (let key in errors) {
          errs.value[key] = errors[key][0]
        }
      } catch {
        console.error(e)
      }
    })
  })
}
</script>

<template>
  <h3>Login</h3>

  <ErrsMsg v-for="(err, index) in errs">{{index}}: {{err}}</ErrsMsg>

  <form id="login-form" action="user/login/" method="POST" class="w-25">
    <input type="text" name="username" class="mb-2 form-control" placeholder="ID">

    <input type="password" name="password" class="mb-2 form-control" placeholder="Password">

    <input type="button" @click="clickLogin" value="Login" class="mb-3 btn btn-dark">
  </form>

  <span>If you do not have a account, please <a href="#" @click="emits('switch-component', Signup)">Sign up</a> here.</span>
</template>
