<template>
  <div class="p-4 space-y-4">
    <h1 class="text-xl font-bold">Test Group Edit</h1>

    <div class="space-y-2">
      <label class="block">Leader First Name</label>
      <input v-model="leader.firstName" class="border p-2 rounded w-full" />

      <label class="block">Leader Last Name</label>
      <input v-model="leader.lastName" class="border p-2 rounded w-full" />

      <label class="block">Leader Email</label>
      <input v-model="leader.email" class="border p-2 rounded w-full" />
    </div>

    <div class="space-y-2">
      <h2 class="font-semibold">Members</h2>
      <div
        v-for="(m, i) in members"
        :key="i"
        class="border p-3 rounded space-y-1"
      >
        <input
          v-model="m.firstName"
          placeholder="First Name"
          class="border p-1 rounded w-full"
        />
        <input
          v-model="m.lastName"
          placeholder="Last Name"
          class="border p-1 rounded w-full"
        />
        <input
          v-model="m.email"
          placeholder="Email"
          class="border p-1 rounded w-full"
        />
      </div>
      <button @click="addMember" class="px-3 py-1 bg-gray-300 rounded">
        Add Member
      </button>
    </div>

    <button @click="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
      Submit Test Request
    </button>

    <div v-if="error" class="mt-4 p-3 bg-red-200 text-red-800 rounded">
      <h3 class="font-semibold">Error</h3>
      <div>{{ error.message }}</div>
      <div v-if="error.failedIndexes">
        Failed Indexes: {{ error.failedIndexes }}
      </div>
    </div>

    <div v-if="success" class="mt-4 p-3 bg-green-200 text-green-800 rounded">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const leader = ref({ firstName: "", lastName: "", email: "" });
const members = ref([]);
const error = ref(null);
const success = ref(null);

function addMember() {
  members.value.push({ firstName: "", lastName: "", email: "" });
}

async function submit() {
  error.value = null;
  success.value = null;

  try {
    const res = await $fetch("/api/editGroup", {
      method: "POST",
      body: {
        leader: leader.value,
        members: members.value,
      },
    });
    success.value = "Group edited successfully";
  } catch (err) {
    error.value = {
      message: err?.data?.message || "Unknown error",
      failedIndexes: err?.data?.data?.failedIndexes || null,
    };
  }
}
</script>

<style scoped></style>
