<script setup>
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import router from "../router";
import {Modal} from 'bootstrap';
import ErrsMsg from "../components/ErrsMsg.vue";


defineEmits(['set-user', 'set-perms']);
const {user} = defineProps(['user']);
const instance = getCurrentInstance();
const errs = ref({});
const orderGoods = ref(1);
const goodGroup = ref(['']);
const goods = ref({});
const address = ref('');
let csrfmiddlewaretoken = '';

watch(() => orderGoods.value, (newOrderGoods) => {
  orderGoods.value = newOrderGoods>0?newOrderGoods:1;
})

onMounted(() => {
  instance.proxy.$axios.get('order/').then(respond => {
    goodGroup.value.push(...respond.data['group']);
    address.value = respond.data['address'];
    csrfmiddlewaretoken = respond.data['csrfmiddlewaretoken'];
  });
})

function setSelect(target) {
  const select = document.getElementById(target.id.replace('group', 'name'));
  select.innerHTML = '';
  select.appendChild(new Option('', ''));
  for (let good of goods.value[target.value]) {
    select.appendChild(new Option(good, good));
  }
}

function getGood(target) {
  checkValidation();

  if (target.value === '') {
    return
  }
  if (!goods.value[target.value]) {
    instance.proxy.$axios.get(`order/${target.value}/`).then(respond => {
      goods.value[target.value] = respond.data['goods'];
      setSelect(target);
    }).catch(error => {
      setSelect(target);
    });
    return
  }
  setSelect(target);
}

function checkValidation(){
  const form = document.querySelector('.need-validation')

  if (!form.checkValidity()) {
    document.getElementById('add-btn').disabled = true
    document.getElementById('submit-btn').disabled = true
  }else if (form.checkValidity()) {
    document.getElementById('add-btn').disabled = false
    document.getElementById('submit-btn').disabled = false
  }

  form.classList.add('was-validated')
}

function clickAdd() {
  orderGoods.value++;
  document.getElementById('add-btn').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}

function checkValue(event) {
  checkValidation()
  const target = event.target;
  target.value = target.value>0?target.value:1;
}

function submitOrder() {
  const form = document.querySelector('.need-validation');
  const formData = new FormData(form);

  errs.value = {};
  formData.set('csrfmiddlewaretoken', csrfmiddlewaretoken);

  instance.proxy.$axios.post('order/', formData).then(response => {
    const modal = new Modal(document.getElementById('hintModal'));
    modal.show(modal);
  }).catch(error => {
    console.log('hi');
    try {
      const errors = error.response.data.errors;

      for (let key in errors) {
        errs.value[key] = errors[key][0];
      }
    } catch (e) {
      console.error(e);
    }
    console.log(errs.value);
  });
}

function clickClose() {
  router.push({name: 'home'})
}
</script>

<template>
  <div class="modal fade" id="hintModal" tabindex="-1" aria-labelledby="hintModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="hintModalLabel">Order Successfully</h1>
        </div>
        <div class="modal-body">
          You have successfully ordered!
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="clickClose">Close</button>
        </div>
      </div>
    </div>
  </div>

  <h1 class="border-bottom">Order</h1>

  <ErrsMsg v-for="(err, index) in errs">{{index}}: {{err}}</ErrsMsg>

  <form action="order/" class="need-validation">
    <input type="hidden" name="username" :value="user.username">
    <div v-for="orderGood in orderGoods" class="mb-3">
      <div class="input-group mb-3">
        <span class="input-group-text">Group</span>
        <select
          @change="getGood($event.target)"
          :id="`order${orderGood}-group`"
          :name="`group${orderGood}`"
          class="form-select"
          required
        >
          <option :value="group" v-for="group in goodGroup">{{group}}</option>
        </select>

        <span class="input-group-text">Name</span>
        <select
          @change="checkValidation"
          :id="`order${orderGood}-name`"
          :name="`name${orderGood}`"
          class="form-select"
          required
        >
          <option/>
        </select>

        <span class="input-group-text">Quantity</span>
        <input
          @change="checkValue($event)"
          :id="`order${orderGood}-quantity`"
          :name="`quality${orderGood}`"
          type="number"
          value="1"
          class="form-control"
          required
        >
      </div>
    </div>

    <label for="due-date" class="form-label">Due Date</label>
    <input
      @change="checkValidation"
      type="date"
      name="due_date"
      id="due-date"
      class="form-control"
      required
    >

    <p>Address: {{address}}</p>

    <div class="float-end">
      <input type="button" @click="orderGoods--" class="me-2 btn btn-outline-danger" value="Remove">
      <input id="add-btn" type="button" @click="clickAdd" class="me-2 btn btn-outline-success" value="Add" disabled>
      <input id="submit-btn" type="button" @click="submitOrder" class="btn btn-dark" value="Order" disabled>
    </div>
  </form>
</template>
