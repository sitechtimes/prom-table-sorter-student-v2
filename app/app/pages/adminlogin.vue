<template>
  <div v-if="!loggedIn" class="place-items-center">
    <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4">
  <legend class="fieldset-legend">Login</legend>

  <label class="label">Email</label>
  <input type="email" class="input" placeholder="Email" v-model="username"/>

  <label class="label">Password</label>
  <input type="password" class="input" placeholder="Password" v-model="pass"/>

  <button class="btn btn-neutral mt-4" @click="login">Login</button>
</fieldset>
  </div>
  <div v-else class="m-2">
    You are currently logged in.
    <button class="btn bg-base-100" @click="logout"> Sign Out</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { loggedIn, clear: clearSession, fetch: refreshSession } = useUserSession()

const username = ref<string>("")
const pass = ref<string>("")
async function login(){
  const email = username.value
  const password = pass.value
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      })
    })
    await refreshSession()
    const data = await res.json();
    
    if (!res.ok) {
      alert(data.message);
      return;
    } else if (res.ok) {
      await navigateTo("/AdminEnd")
    }
  } catch (error) {
    console.log(error)
  }
}

async function logout(){
  await clearSession()
  await navigateTo('/')
}
</script>

<style scoped></style>
