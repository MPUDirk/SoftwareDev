<template>
  <div class="alert alert-danger" role="alert">
    <slot/>
    <button
      type="button"
      @click="clickClose"
      class="btn btn-sm btn-danger float-end"
      data-bs-dismiss="alert"
      aria-label="Close"
    >close</button>
  </div>
</template>
