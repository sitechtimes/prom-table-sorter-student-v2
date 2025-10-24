<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6 form"
    >
      <div>
        <h1 class="text-black text-3xl font-bold text-center mb-6">
          Upload Excel file of those who paid
        </h1>
        <label class="uploadBtn" for="upload-file2"><img src="" /></label>
        <input
          id="upload-file2"
          class="upload-btn"
          type="file"
          name="input-groups"
          ref="uploadedPaidFile"
          accept=".xlsx"
          @change="validDataFormat = !validDataFormat"
        />

        <img
          class="example"
          @click="showpaidExample = !showpaidExample"
          src=""
        />
      </div>
      <div>
        <h1 class="text-black text-3xl font-bold text-center mb-6">
          Enter a range for table sizes:
        </h1>
        <h2 class="text-black font-semibold text-center mt-4">From</h2>
        <input
          type="number"
          class="input input-bordered mb-4"
          v-model.number="minSeats"
        />
        <h2 class="text-black font-semibold text-center mt-4">to</h2>
        <input
          type="number"
          class="input input-bordered mb-4"
          v-model.number="maxSeats"
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
      <h2>{{ noSeat }}</h2>
      <TableVisualizer />
    </div>

    <button class="btn" @click="">List of all tables</button>

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
const ExcelJS = require("exceljs"); //reading excel for people who have paid and aren't entered in a group
//all excelJS variables
const dataFormat = ref(null);
const cellRange = ref([null, null]);
const searchAllCells = ref(false);
const validDataFormat = ref(true);
//other variables
const minSeats = ref<number>();
const maxSeats = ref<number>();
const tableCount = ref<number>(0);
const notPaid = ref<Student[]>([]);
const noSeat = ref<Student[]>([]);
const Groups = ref<Array<Group>>([]);
const Tables = ref<Group[]>([]);
let showpaidExample = ref(false);

function populateArrays() {
  // This will populate the notPaid and noSeat (compare all students entered vs. students who paid) once excel is imported and using mongoDB data
}
</script>
