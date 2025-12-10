<template>
  <div class="p-6 text-black">
    <h1 class="text-2xl font-bold mb-4">Test Group Fetch</h1>

    <button class="btn btn-primary mb-4" @click="fetchGroups">
      Load Groups
    </button>
  </div>
</template>

<script setup lang="ts">
async function fetchGroups() {
  try {
    const res = await fetch("/api/allGroups"); // adjust if your route name differs

    if (!res.ok) {
      throw new Error("Failed to fetch groups");
    }

    const data = await res.json();
    console.log(data);
  } catch (err: any) {
    console.error(err);
  }
}
</script>
