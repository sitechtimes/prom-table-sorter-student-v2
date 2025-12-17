<template>
  <h1 class="text-xl">Group API Test</h1>

  <button @click="submitGroup" class="px-4 py-2 bg-white text-black rounded">
    Test Create Group
  </button>

  <div v-if="response" class="mt-4 p-3 bg-white text-black rounded">
    <h2 class="font-semibold">Response:</h2>
    <pre>{{ response }}</pre>
  </div>
</template>

<script setup>
import { ref } from "vue";

const response = ref(null);

const submitGroup = async () => {
  response.value = "Sending request";

  const groupData = {
    leader: {
      first_name: "Jane",
      last_name: "Doe",
      email: "test3@gmail.com",
      osis: 123456789,
    },
    members: [
      // {
      //   first_name: "A",
      //   last_name: "B",
      //   email: "test5@gmail.com",
      //   osis: 987654321,
      // },
      //   {
      //     first_name: "Charlie",
      //     last_name: "Kim",
      //     email: "charlie.kim@example.com",
      //     osis: 192837465,
      //   },
    ],
  };

  try {
    const res = await $fetch("/api/createGroup", {
      method: "POST",
      body: groupData,
    });
    response.value = JSON.stringify(res, null, 2);
  } catch (err) {
    response.value = JSON.stringify(err.data || err, null, 2);
  }
};
</script>
