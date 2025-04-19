<script setup>
import {shallowRef, watch} from "vue";

import Home from "@/components/home/Home.vue";
import Login from "@/components/home/Login.vue";


const emits = defineEmits(['set-user', 'set-perms'])
const {user} = defineProps(['user'])
const currentComponent = shallowRef(user.isAuthenticated ? Home : Login)

watch(() => user, (newUser) => {
  currentComponent.value = newUser.isAuthenticated ? Home : Login
})

function handleSwitchComponent(component) {
  currentComponent.value = component
}
</script>

<template>
  <h1 class="border-bottom">Welcome to the Order Management System</h1>

  <component
      :is="currentComponent"
      :user="user"
      @set-user="emits('set-user', $event)"
      @set-perms = "emits('set-perms', $event)"
      @switch-component="handleSwitchComponent"
  />
</template>
