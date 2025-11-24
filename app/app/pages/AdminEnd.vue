<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6 form"
    >
      <div>
        <h1 class="text-black text-3xl font-bold text-center mb-4">
          Upload Excel file of those who paid
        </h1>
        <label class="uploadBtn" for="upload-file2"><img src="" /></label>
        <input
          id="upload-file2"
          class="file-input"
          type="file"
          name="input-groups"
          ref="paidFile"
          accept=".xlsx"
          @change="compareSeatAndPay"
        />
        <button
          class="btn mt-4 mb-2"
          @click="showPaidExample = !showPaidExample"
        >
          Click here to open/close example
        </button>
        <img
          class="example"
          v-if="showPaidExample"
          src="../assets/paidExample.png"
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
      <h1 class="text-black text-3xl font-bold text-center mb-4">
        Students that haven't paid and at a table:
      </h1>
      <h2>
        <div
          v-if="notPaid.length !== 0"
          v-for="student in notPaid"
          :key="student.osis"
          class="text-black font-semibold text-center mb-2"
        >
          {{ student.firstName }} {{ student.lastName }}
        </div>
        <h2 v-else class="text-black font-semibold text-center mb-2">
          Empty, enter an excel to display.
        </h2>
      </h2>
      <h1 class="text-black text-3xl font-bold text-center mb-4">
        Students that have paid and not at a table:
      </h1>
      <h2>
        <div
          v-if="noSeat.length !== 0"
          v-for="student in noSeat"
          :key="student.email"
          class="text-black font-semibold text-center mb-2"
        >
          {{ student.name }}
        </div>
        <h2 v-else class="text-black font-semibold text-center mb-2">
          Empty, enter an excel to display.
        </h2>
      </h2>
      <TableVisualizer />
    </div>

    <button class="btn" @click="executeSort()">List of all tables</button>
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
            <td>
              {{ group?.groupLeader.firstName }}
              {{ group?.groupLeader.lastName }}
            </td>
            <td v-for="member in group.members">
              {{ member.firstName }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ExcelJS from "exceljs";
const paidFile = ref<HTMLInputElement | null>(null);
const minSeats = ref<number>();
const maxSeats = ref<number>();
const notPaid = ref<Student[]>([]);
const noSeat = ref<ImportedStudent[]>([]);
const Groups = ref<Group[]>([
  {
    groupLeader: {
      firstName: "Ava",
      lastName: "Johnson",
      email: "avaj583920174@nycstudents.net",
      osis: "102938475",
    },
    members: [
      {
        firstName: "Mila",
        lastName: "Chen",
        email: "milac491027365@nycstudents.net",
      },
    ],
  },
  {
    groupLeader: {
      firstName: "Leo",
      lastName: "Rossi",
      email: "leor839174620@nycstudents.net",
      osis: "564738291",
    },
    members: [
      {
        firstName: "Noah",
        lastName: "Smith",
        email: "noahs720493158@nycstudents.net",
      },
      {
        firstName: "Ella",
        lastName: "Rivera",
        email: "ellar@nycstudents.net",
      },
      {
        firstName: "Lucas",
        lastName: "Kim",
        email: "lucask947205613@nycstudents.net",
      },
    ],
  },
  {
    groupLeader: {
      firstName: "Sofia",
      lastName: "Martinez",
      email: "sofiam260591834@nycstudents.net",
      osis: "948372615",
    },
    members: [
      {
        firstName: "Olivia",
        lastName: "Brown",
        email: "oliviab@nycstudents.net",
      },
      {
        firstName: "Henry",
        lastName: "Lee",
        email: "henryl572019463@nycstudents.net",
      },
      {
        firstName: "Aiden",
        lastName: "Patel",
        email: "aidenp604937128@nycstudents.net",
      },
      {
        firstName: "Grace",
        lastName: "Wong",
        email: "gracew932741650@nycstudents.net",
      },
      {
        firstName: "James",
        lastName: "Lopez",
        email: "jamesl875103942@nycstudents.net",
      },
      {
        firstName: "Chloe",
        lastName: "Adams",
        email: "chloea514620987@nycstudents.net",
      },
      {
        firstName: "Ethan",
        lastName: "Nguyen",
        email: "ethann309875416@nycstudents.net",
      },
    ],
  },
  {
    groupLeader: {
      firstName: "Isabella",
      lastName: "Green",
      email: "isabellag728104563@nycstudents.net",
      osis: "127483920",
    },
    members: [
      {
        firstName: "Daniel",
        lastName: "King",
        email: "danielk190473826@nycstudents.net",
      },
      {
        firstName: "Ari",
        lastName: "Gold",
        email: "arig543298710@nycstudents.net",
      },
      {
        firstName: "Luna",
        lastName: "Castro",
        email: "lunac817205349@nycstudents.net",
      },
      {
        firstName: "Elijah",
        lastName: "Diaz",
        email: "elijahd605819274@nycstudents.net",
      },
      {
        firstName: "Riley",
        lastName: "Morris",
        email: "rileym290471685@nycstudents.net",
      },
      {
        firstName: "Zoe",
        lastName: "Clark",
        email: "zoec958201647@nycstudents.net",
      },
      {
        firstName: "Mateo",
        lastName: "Santos",
        email: "mateos481935027@nycstudents.net",
      },
      {
        firstName: "Nora",
        lastName: "Baker",
        email: "norab702185934@nycstudents.net",
      },
      {
        firstName: "Sebastian",
        lastName: "Reyes",
        email: "sebastianr614209875@nycstudents.net",
      },
      {
        firstName: "Liam",
        lastName: "Turner",
        email: "liamt879216340@nycstudents.net",
      },
    ],
  },
]);

const Tables = ref<Table[]>([]);
let showPaidExample = ref(false);

interface ImportedStudent {
  email: string; //may end up being OSIS later on
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
  const file = paidFile.value?.files?.[0];
  if (!file) {
    alert("Please upload a paid list Excel file.");
    return [];
  }
  try {
    const workbook = new ExcelJS.Workbook();
    const fileBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(fileBuffer);

    const paidSheet = workbook.worksheets[0];
    const paidList = <ImportedStudent[]>[];
    if (!paidSheet) return;
    for (let i = 1; i <= paidSheet.actualRowCount; i++) {
      const name = paidSheet.getCell(`A${i}`).value;
      const email = paidSheet.getCell(`B${i}`).value ?? i;
      if (name && typeof email === "string") {
        paidList.push({ name: String(name), email });
      }
    }
    return paidList;
  } catch (error) {
    alert(error);
    return [];
  }
}
async function compareSeatAndPay() {
  const file = paidFile.value?.files?.[0];
  if (!file) {
    alert("Please upload a paid list Excel file.");
    return [];
  }
  const paidList = await getPaidList();
  if (!paidList)
    return alert(
      "Couldn't retrieve excel data, please ensure the data follows the example"
    );
  const attending: Student[] = Groups.value.flatMap((group: Group) => [
    group.groupLeader,
    ...group.members,
  ]);
  const paidEmails = paidList.map((p) => String(p.email).trim());
  const attendingEmails = attending.map((p) => String(p.email).trim());
  notPaid.value = attending.filter(
    (person) => !paidEmails.includes(String(person.email).trim())
  );
  noSeat.value = paidList.filter(
    (p) => !attendingEmails.includes(String(p.email).trim())
  );
}
async function executeSort() {
  await fetchGroups();

  try {
    if (typeof maxSeats.value != "number" || typeof minSeats.value != "number")
      return alert("Please enter a number for max and min seats");
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
onMounted(() => {
  // fetchGroups();
});
</script>
