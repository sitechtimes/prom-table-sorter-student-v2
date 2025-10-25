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
        Students that haven't paid and not at a table:
      </h1>
      <h2>
        <div v-for="student in notPaid" :key="student.osis">
          {{ student.firstName }} {{ student.lastName }}
        </div>
      </h2>
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Students that have paid and not at a table:
      </h1>
      <h2>
        <div v-for="student in noSeat" :key="student.id">
          {{ student.name }}
        </div>
      </h2>
      <TableVisualizer />
    </div>

    <button class="btn" @click="">List of all tables</button>
    <div class="overflow-x-auto">
      <!--Update this to display members by all groups in a table then all individuals at a table-->
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Group Leader</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(group, i) in Groups">
            <th>{{ i + 1 }}</th>
            <td>{{ group?.groupLeader }}</td>
            <td>{{ group?.members }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
//all excelJS variables
const ExcelJS = require("exceljs"); //reading excel for people who have paid and aren't entered in a group
const paidFile = ref<HTMLInputElement | null>(null);
//other variables
const minSeats = ref<number>();
const maxSeats = ref<number>();
const notPaid = ref<Student[]>([]);
const noSeat = ref<ImportedStudent[]>([]);
const Groups = ref<Group[]>([]);
const Tables = ref<Table[]>([]);
let showpaidExample = ref(false);

interface ImportedStudent {
  id: string | number;
  name: string;
}

async function fetchGroups() {
  try {
    const res = await fetch(""); //backend
    if (!res.ok) throw Error("couldnt fetch data");
    const data: Group[] = await res.json();
    Groups.value = data;
  } catch (error) {
    alert(error);
  }
}
async function getPaidList() {
  if (!paidFile.value || !paidFile.value.files?.[0]) {
    alert("Please upload a paid list Excel file.");
    return [];
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const fileBuffer = await paidFile.value.files[0].arrayBuffer();
    await workbook.xlsx.load(fileBuffer);

    const paidSheet = workbook.worksheets[0];
    const paidList = <ImportedStudent[]>[];

    for (let i = 1; i <= paidSheet.actualRowCount; i++) {
      const name = paidSheet.getCell(`A${i}`).value;
      const id = paidSheet.getCell(`B${i}`).value ?? i; //if cell is empty
      if (name) {
        paidList.push({ name: String(name), id });
      }
    }

    return paidList;
  } catch (error) {
    alert(error);
    return [];
  }
}
async function compareSeatAndPay() {
  const paidList = await getPaidList();
  const attending: Student[] = Groups.value.flatMap(
    (group: Group) => group.members
  );
  const paidIDs = paidList.map((p) => String(p.id));
  notPaid.value = attending.filter(
    (person) => !paidIDs.includes(String(person.osis ?? ""))
  );
  const attendingIDs = attending.map((p) => String(p.osis ?? ""));
  noSeat.value = paidList.filter((p) => !attendingIDs.includes(String(p.id)));
}
async function executeSort() {
  await fetchGroups();

  try {
    Tables.value = rangeSort(
      Groups.value,
      algoFunctionOptions,
      maxSeats.value,
      minSeats.value
    ) as Table[];

    await compareSeatAndPay();
  } catch (error: any) {
    alert(error.message);
  }
}
</script>
