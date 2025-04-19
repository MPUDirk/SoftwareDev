<script setup>
import Login from "@/components/home/Login.vue";
import {getCurrentInstance, ref} from "vue";


const emits = defineEmits(["switch-component"]);
const instance = getCurrentInstance();
const {user, csrfmiddlewaretoken} = defineProps(['user', 'csrfmiddlewaretoken'])
const errs = ref({})

const clickSignup = () => {
  const form = document.getElementById("signup-form");
  const form_data = new FormData(form);

  instance.proxy.$axios.post(form.getAttribute("action"), form_data).then(response => {
    const username = response.data.username;
    alert(`Signed up successfully! your account ID is ${username}, wait for your administrator confirm, pls`);
    emits('switch-component', Login)
  }).catch(e => {
    errs.value = {}
    try {
      const errors = e.response.data.errors

      for (let key in errors) {
        errs.value[key] = errors[key][0]
      }
    } catch {
      console.error(e)
    }
  })
}
</script>

<template>
  <h3>Sign up</h3>

  <form id="signup-form" action="user/signup/" method="POST" class="w-25">
    <input type="hidden" name="csrfmiddlewaretoken" :value="csrfmiddlewaretoken">

    <input type="text" name="first_name" class="mb-2 form-control" placeholder="First name">

    <input type="text" name="last_name" class="mb-2 form-control" placeholder="Last name">

    <input type="password" name="password1" class="mb-2 form-control" placeholder="Password">

    <input type="password" name="password2" class="mb-2 form-control" placeholder="Confirm Password">

    <input type="button" value="Sign up" class="mb-3 btn btn-dark" @click="clickSignup">
  </form>

  <span>If you have already had a account, please <a href="#" @click="emits('switch-component', Login)">Log in</a> here.</span>
</template>