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
        Students that haven't paid and at a table:
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
const Groups = ref<Group[]>([
  //asked chatgpt to generate example groups for me
  // Small group - 1 member
  {
    groupLeader: {
      firstName: "Ava",
      lastName: "Johnson",
      email: "ava.johnson@nycstudents.net",
      osis: "102938475",
    },
    members: [
      {
        firstName: "Mila",
        lastName: "Chen",
        email: "mila.chen@nycstudents.net",
      },
    ],
  },

  // Medium group - 3 members
  {
    groupLeader: {
      firstName: "Leo",
      lastName: "Rossi",
      email: "leo.rossi@nycstudents.net",
      osis: "564738291",
    },
    members: [
      {
        firstName: "Noah",
        lastName: "Smith",
        email: "noah.smith@nycstudents.net",
      },
      {
        firstName: "Ella",
        lastName: "Rivera",
        email: "ella.rivera@nycstudents.net",
      },
      {
        firstName: "Lucas",
        lastName: "Kim",
        email: "lucas.kim@nycstudents.net",
      },
    ],
  },

  // Large group - 7 members
  {
    groupLeader: {
      firstName: "Sofia",
      lastName: "Martinez",
      email: "sofia.martinez@nycstudents.net",
      osis: "948372615",
    },
    members: [
      {
        firstName: "Olivia",
        lastName: "Brown",
        email: "olivia.brown@nycstudents.net",
      },
      {
        firstName: "Henry",
        lastName: "Lee",
        email: "henry.lee@nycstudents.net",
      },
      {
        firstName: "Aiden",
        lastName: "Patel",
        email: "aiden.patel@nycstudents.net",
      },
      {
        firstName: "Grace",
        lastName: "Wong",
        email: "grace.wong@nycstudents.net",
      },
      {
        firstName: "James",
        lastName: "Lopez",
        email: "james.lopez@nycstudents.net",
      },
      {
        firstName: "Chloe",
        lastName: "Adams",
        email: "chloe.adams@nycstudents.net",
      },
      {
        firstName: "Ethan",
        lastName: "Nguyen",
        email: "ethan.nguyen@nycstudents.net",
      },
    ],
  },

  // Very large group - 10 members
  {
    groupLeader: {
      firstName: "Isabella",
      lastName: "Green",
      email: "isabella.green@nycstudents.net",
      osis: "127483920",
    },
    members: [
      {
        firstName: "Daniel",
        lastName: "King",
        email: "daniel.king@nycstudents.net",
      },
      { firstName: "Ari", lastName: "Gold", email: "ari.gold@nycstudents.net" },
      {
        firstName: "Luna",
        lastName: "Castro",
        email: "luna.castro@nycstudents.net",
      },
      {
        firstName: "Elijah",
        lastName: "Diaz",
        email: "elijah.diaz@nycstudents.net",
      },
      {
        firstName: "Riley",
        lastName: "Morris",
        email: "riley.morris@nycstudents.net",
      },
      {
        firstName: "Zoe",
        lastName: "Clark",
        email: "zoe.clark@nycstudents.net",
      },
      {
        firstName: "Mateo",
        lastName: "Santos",
        email: "mateo.santos@nycstudents.net",
      },
      {
        firstName: "Nora",
        lastName: "Baker",
        email: "nora.baker@nycstudents.net",
      },
      {
        firstName: "Sebastian",
        lastName: "Reyes",
        email: "sebastian.reyes@nycstudents.net",
      },
      {
        firstName: "Liam",
        lastName: "Turner",
        email: "liam.turner@nycstudents.net",
      },
    ],
  },
]);

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
