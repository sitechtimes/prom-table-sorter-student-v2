<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Enter a range for table sizes:
      </h1>
      <div>
        <h2 class="text-black font-semibold text-center mt-4">From</h2>
        <input
          type="number"
          class="input input-bordered mb-4"
          v-model.number="peopleTableMin"
        />
        <h2 class="text-black font-semibold text-center mt-4">to</h2>
        <input
          type="number"
          class="input input-bordered mb-4"
          v-model.number="peopleTableMax"
        />
      </div>
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Enter an input for number of tables:
      </h1>
      <div>
        <input
          type="number"
          class="input input-bordered mb-4"
          v-model.number="tableCount"
        />
      </div>
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Students that haven't paid and not at a table:
      </h1>
      <h2>{{ notPaid }}</h2>
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Students that have paid and not at a table:
      </h1>
      <h2>{{ noTable }}</h2>
      <TableVisualizer />
    </div>

    <button class="btn" @click="sortTables">List of all tables</button>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Group Leader</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(table, i) in Tables">
            <th>{{ i + 1 }}</th>
            <td>{{ table?.groupLeader }}</td>
            <td>{{ table?.members }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
const peopleTableMin = ref<number>();
const peopleTableMax = ref<number>();
const tableCount = ref<number>(0);
const notPaid = ref<Student[]>([]);
const noTable = ref<Student[]>([]);
const Tables = ref<Table[]>([]);

function populateArrays() {
  // This will populate the notPaid and noTable arrays using MongoDB
}

function sortTables() {
  for (let i = 1; i <= tableCount.value; i++) {
    // Use data from MongoDB to create all the tables
  }
}

async function retrieveData() {
  try {
    const res = await fetch("", {
      // backend here
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("Pulled:", data);
  } catch (err) {
    alert("Couldn't pull data from MongoDB");
    console.log(err);
  }
}

onMounted(() => retrieveData());
</script>
