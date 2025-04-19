<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";


defineEmits(['set-user', 'set-perms'])
const props = defineProps(['csrfmiddlewaretoken', 'user'])
const instance = getCurrentInstance()
const staffs = ref({
  application: [],
  active: []
})

onMounted(() => {
  instance.proxy.$axios.get("user/").then(response => {
    staffs.value = response.data;
    console.log(staffs.value);
  })
})

function clickDel(t, staff) {
  instance.proxy.$axios.get("user/" + staff['username'] + "/del/").then(() => {
    staffs.value[t] = staffs.value[t].filter(s => s['username'] !== staff['username'])
  })
}

function clickAccept(staff) {
  instance.proxy.$axios.get("user/" + staff['username'] + "/accept").then(() => {
    staffs.value['application'] = staffs.value['application'].filter(s => s['username'] !== staff['username'])
    staffs.value['active'].push(staff)
  })
}
</script>

<template>
  <h1 class="border-bottom">Staff Management</h1>

  <div class="my-3">
    <h4>registration Application</h4>
    <ul class="list-group">
      <li v-for="staff in staffs['application']" class="list-group-item">
        <form method="POST" class="d-flex justify-content-between align-items-center">
          <input type="hidden" name="csrfmiddlewaretoken" :value="props.csrfmiddlewaretoken">
          {{ staff['first_name'] }} {{ staffs['last_name'] }}
          <div>
            <input @click="clickAccept(staff)" type="button" class="me-2 btn btn-sm btn-success" value="Accept">
            <input @click="clickDel('application', staff)" type="button" class="btn btn-sm btn-warning" value="Reject">
          </div>
        </form>
      </li>
      <li v-if="staffs['application'].length === 0" class="list-group-item">
        No Staff Application
      </li>
    </ul>

  </div>

  <div>
    <h4>Staff Mange</h4>
    <ul class="list-group">
      <li v-for="staff in staffs['active']" class="list-group-item">
        <form method="POST" class="d-flex justify-content-between align-items-center">
          <input type="hidden" name="csrfmiddlewaretoken" :value="props.csrfmiddlewaretoken">
          {{ staff['first_name'] }} {{ staff['last_name'] }}
          <input @click="clickDel('active', staff)" type="button" class="btn btn-sm btn-danger" value="Delete">
        </form>
      </li>
      <li v-if="staffs['active'].length === 0" class="list-group-item">
        No Staff
      </li>
    </ul>
  </div>
</template>
