<template>
  <div>
    <NuxtLink to="/AdminEnd">Click here for now</NuxtLink>
    <fieldset class="fieldset bg- border-base-300 rounded-box w-xs border p-4">
  <legend class="fieldset-legend">Login</legend>

  <label class="label">Email</label>
  <input type="email" class="input" placeholder="Email" v-model="user"/>

  <label class="label">Password</label>
  <input type="password" class="input" placeholder="Password" v-model="pass"/>

  <button class="btn btn-neutral mt-4" @click="login">Login</button>
</fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const user = ref<string>("").value
const pass = ref<string>("").value
async function login(){
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        pass
      })
    })
    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
