<script setup>
import {getCurrentInstance, ref} from "vue";
import {Modal} from "bootstrap";
import Login from "@/components/home/Login.vue";
import ErrsMsg from "../ErrsMsg.vue";


defineProps(['user'])
const emits = defineEmits(["switch-component"]);
const instance = getCurrentInstance();
const errs = ref({})

const clickSignup = () => {
  const form = document.getElementById("signup-form");
  const form_data = new FormData(form);

  errs.value = {}

  const url = form.getAttribute("action");
  instance.proxy.$axios.get(url).then(response => {
    form_data.set('csrfmiddlewaretoken', response.data)
    instance.proxy.$axios.post(url, form_data).then(() => {
      const modalInstance = new Modal(document.getElementById('tipModal'))
      modalInstance.show(modalInstance)
    }).catch(e => {
      try {
        const errors = e.response.data.errors

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
  <div class="modal fade" id="tipModal" tabindex="-1" aria-labelledby="tipModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="tipModalLabel">Modal title</h1>
        </div>
        <div class="modal-body">
          Signup successfully! You can login now
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark"
            data-bs-dismiss="modal"
            @click="emits('switch-component', Login)"
          >Login Now</button>
        </div>
      </div>
    </div>
  </div>
  <ErrsMsg v-for="(err, index) in errs">{{index}}: {{err}}</ErrsMsg>
  <h3>Sign up</h3>

  <form id="signup-form" action="user/signup/" method="POST" class="w-25">
    <input type="text" name="username" class="mb-2 form-control" placeholder="ID">

    <input type="text" name="first_name" class="mb-2 form-control" placeholder="First name">

    <input type="text" name="last_name" class="mb-2 form-control" placeholder="Last name">

    <input type="text" name="email" class="mb-2 form-control" placeholder="Email">

    <input type="text" name="address" class="mb-2 form-control" placeholder="address">

    <input type="password" name="password1" class="mb-2 form-control" placeholder="Password">

    <input type="password" name="password2" class="mb-2 form-control" placeholder="Confirm Password">

    <input type="button" value="Sign up" class="mb-3 btn btn-dark" @click="clickSignup">
  </form>

  <span>If you have already had a account, please <a href="#" @click="emits('switch-component', Login)">Log in</a> here.</span>
</template>
