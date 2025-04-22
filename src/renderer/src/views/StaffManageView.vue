<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {Modal} from "bootstrap";
import ErrsMsg from "../components/ErrsMsg.vue";


defineEmits(['set-user', 'set-perms'])
const props = defineProps(['user'])
const instance = getCurrentInstance()
const errs = ref({})
const staffs = ref([])

onMounted(() => {
  instance.proxy.$axios.get("user/").then(response => {
    staffs.value = response.data.staffs;
  })
})

function clickDel(staff) {
  instance.proxy.$axios.get("user/" + staff['username'] + "/del/").then(() => {
    staffs.value = staffs.value.filter(s => s['username'] !== staff['username'])
  })
}

function clickAdd() {
  const form = document.getElementById("newStaffForm")
  const form_data = new FormData(form)
  const url = form.getAttribute('action');

  instance.proxy.$axios.get(url).then(response => {
    form_data.set('csrfmiddlewaretoken', response.data)

    instance.proxy.$axios.post(url, form_data).then(respond => {
      const staff = {
        "first_name": form_data.get("first_name"),
        "last_name": form_data.get("last_name"),
        "username": respond.data['username'],
      }
      staffs.value.push(staff);
      new Modal(document.getElementById("newStaffModal")).hide()
    }).catch(e => {
      errs.value = {}
      try {
        const errors = e.response.data.errors
        for (let key in errors) {
          errs.value[key] = errors[key][0]
        }
      } catch (e) {
        console.error(e)
      }
    })
  })
}
</script>

<template>
  <div class="modal fade" id="newStaffModal" tabindex="-1" aria-labelledby="newStaffModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newStaffModalLabel">Modal title</h1>
        </div>

        <form id="newStaffForm" action="/user/staff/new/" method="POST">
          <div class="modal-body">
            <label for="first_name">First Name:</label>
            <input type="text" name="first_name" class="form-control">

            <label for="last_name">Last Name:</label>
            <input type="text" name="last_name" class="form-control">

            <label for="password">Password:</label>
            <input type="password" name="password1" class="form-control">

            <label for="password">Confirm Password:</label>
            <input type="password" name="password2" class="form-control">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" @click="clickAdd" class="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <ErrsMsg v-for="(err, index) in errs">{{index}}: {{err}}</ErrsMsg>

  <div>
    <div class="my-3 border-bottom d-flex align-items-center justify-content-between">
      <h1>Staff Management</h1>
      <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#newStaffModal">
        + Staff
      </button>
    </div>

    <ul class="list-group">
      <li v-for="staff in staffs" class="list-group-item d-flex align-items-center justify-content-between">
        <input type="hidden" name="csrfmiddlewaretoken" :value="props.csrfmiddlewaretoken">
        {{ staff['first_name'] }} {{ staff['last_name'] }}({{ staff['username'] }})
        <input @click="clickDel(staff)" type="button" class="btn btn-sm btn-danger" value="Delete">
      </li>
      <li v-if="staffs.length === 0" class="list-group-item">
        No Staff
      </li>
    </ul>
  </div>
</template>
