<script setup>

</script>

<template>
  <div class="modal fade" id="newStaffModal" tabindex="-1" aria-labelledby="newStaffModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newStaffModalLabel">Modal title</h1>
        </div>

        <form id="newStaffForm" action="/goods/new/" method="POST">
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

  <div class="border-bottom d-flex align-items-center justify-content-between">
    <h1>Goods Management</h1>
    <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#newGoodsModal">
      + Staff
    </button>
  </div>
</template>
