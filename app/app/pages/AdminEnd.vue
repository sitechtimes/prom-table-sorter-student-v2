<template>
  <!--asked chatgpt to make styling better cause its an eyesore to look at, eventually replace styling-->
  <div class="flex flex-col items-center min-h-screen bg-gray-200 py-8">
    <div
      class="card w-full border border-gray-300 max-w-3xl bg-white shadow-2xl p-8 rounded-2xl cursor-default form"
    >
      <div>
        <h1 class="text-black text-3xl font-bold text-center mb-6">
          Upload Excel file of those who paid
        </h1>
        <label class="uploadBtn" for="upload-file2"><img src="" /></label>
        <input
          id="upload-file2"
          class="file-input file-input-bordered w-full"
          type="file"
          name="input-groups"
          ref="paidFile"
          accept=".xlsx"
          @change="compareSeatAndPay"
        />
        <button
          class="btn btn-secondary mt-4 mb-2 w-full"
          @click="showPaidExample = !showPaidExample"
        >
          Click here to open/close example
        </button>
        <img
          class="example mx-auto rounded-lg shadow w-1/2"
          v-if="showPaidExample"
          src="../assets/paidExample.png"
        />
      </div>

      <div>
        <h1 class="text-black text-2xl font-bold text-center mb-4">
          Enter a range for table sizes:
        </h1>
        <div class="flex gap-4 justify-center">
          <div>
            <h2 class="text-black font-semibold text-center">From</h2>
            <input
              type="number"
              class="input input-bordered"
              v-model.number="minSeats"
            />
          </div>
          <div>
            <h2 class="text-black font-semibold text-center">To</h2>
            <input
              type="number"
              class="input input-bordered"
              v-model.number="maxSeats"
            />
          </div>
        </div>
      </div>

      <h1 class="text-black text-2xl font-bold text-center my-6">
        Students that haven't paid and at a table:
      </h1>
      <div>
        <div
          v-if="notPaid.length !== 0"
          v-for="student in notPaid"
          :key="student.osis"
          class="text-black font-medium text-center mb-1"
        >
          {{ student.firstName }} {{ student.lastName }}
        </div>
        <p v-else class="text-gray-500 text-center italic">
          Empty, enter an excel to display.
        </p>
      </div>

      <h1 class="text-black text-2xl font-bold text-center my-6">
        Students that have paid and not at a table:
      </h1>
      <div>
        <div
          v-if="noSeat.length !== 0"
          v-for="student in noSeat"
          :key="student.email"
          class="text-black font-medium text-center mb-1"
        >
          {{ student.name }}
        </div>
        <p v-else class="text-gray-500 text-center italic">
          Empty, enter an excel to display.
        </p>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          v-model="includeUnpaidStudents"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Include unpaid students in table sorting
        </label>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          v-model="looseMode"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Filter students loosely (loose: name only, strict: name and email)
        </label>
      </div>
      <TableVisualizer />
    </div>
    <button class="btn btn-primary" @click="executeSort()">
      List of all tables
    </button>
    <button class="btn btn-primary" @click="printTables">
      Display tables to copy and paste
    </button>
    <div
      class="w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8"
    >
      >
      <div class="overflow-x-auto w-1/4 bg-black mt-4" v-if="Tables.length">
        <table class="table table-zebra w-full rounded-xl shadow-lg">
          <thead>
            <tr>
              <th></th>
              <th>Members</th>
              <th># Of Free Seats Left</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(table, i) in Tables">
              <th>{{ i + 1 }}</th>
              <td>
                <div
                  v-for="occupant in table.occupants"
                  :key="occupant.groupLeader.email"
                  class="mb-2"
                >
                  <div class="dropdown dropdown-hover">
                    <label tabindex="0" class="btn btn-sm btn-outline">
                      {{ occupant.groupLeader.firstName }}
                      {{ occupant.groupLeader.lastName }}
                    </label>
                    <ul
                      tabindex="0"
                      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56"
                    >
                      <li class="font-bold text-gray-700">Group Members:</li>
                      <li
                        v-for="member in occupant.members"
                        :key="member.email"
                      >
                        <a>{{ member.firstName }} {{ member.lastName }}</a>
                      </li>
                      <li
                        v-if="occupant.members.length === 0"
                        class="italic text-gray-500"
                      >
                        Singular student, no members
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
              <td>{{ table.unoccupiedSeats }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="stringArray.length > 0"
        class="mt-4 bg-white p-4 rounded-xl shadow w-1/2"
      >
        <div
          v-for="(string, i) in stringArray"
          :key="i"
          class="mb-6 pb-4 border-b border-gray-300"
        >
          <h2 class="text-xl text-black font-bold mb-2">Table {{ i + 1 }}</h2>
          <h3 class="whitespace-pre-wrap text-black">{{ string }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//Strict vs lenient mode
//Strict: check name, osis, email
//Loose mode: just check name
//Student form should indicate legal name MUST be used
import ExcelJS from "exceljs";
const paidFile = ref<HTMLInputElement | null>(null);
const minSeats = ref<number>();
const maxSeats = ref<number>();
const notPaid = ref<Student[]>([]);
const noSeat = ref<ImportedStudent[]>([]);
const includeUnpaidStudents = ref(false);
const looseMode = ref(false);
const stringArray = ref<Array<String>>([]);
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
  name: string;
  email: string; //may end up being OSIS later on
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
  //Maybe should check for capitalization errors in students for the excel, use .toLowerCase()
  const paidList = await getPaidList();
  if (!paidList)
    return alert(
      "Couldn't retrieve excel data, please ensure the data follows the example"
    );
  const groupStudents: Student[] = Groups.value.flatMap((group: Group) => [
    group.groupLeader,
    ...group.members,
  ]);

  if (looseMode.value === true) {
    //loose mode does not work right now, notpaid and noseat currently return empty arrays
    notPaid.value = groupStudents.filter((groupStudent) => {
      !paidList.some(
        (paidStudent) =>
          paidStudent.name ===
          `${groupStudent.firstName} ${groupStudent.lastName}`
      );
    });
    noSeat.value = paidList.filter((paidStudent) => {
      !groupStudents.some((groupStudent) => {
        if (
          `${groupStudent.firstName} ${groupStudent.lastName}` ===
          paidStudent.name
        )
          return true;
      });
    });
    console.log(notPaid.value);
    console.log(noSeat.value);
  } else {
    //strict mode
    const paidEmails = paidList.map((student) => student.email);
    const groupEmails = groupStudents.map((student) => student.email);
    notPaid.value = groupStudents.filter(
      (groupStudent) =>
        !paidEmails.includes(groupStudent.email) &&
        !paidList.some(
          (paidStudent) =>
            paidStudent.name ===
            `${groupStudent.firstName} ${groupStudent.lastName}`
        )
    );
    noSeat.value = paidList.filter(
      (paidStudent) =>
        !groupEmails.includes(paidStudent.email) &&
        !groupStudents.some(
          (groupStudent) =>
            `${groupStudent.firstName} ${groupStudent.lastName}` ===
            paidStudent.name
        )
    );
    console.log(notPaid.value);
    console.log(noSeat.value);
  }
}
async function executeSort() {
  // await fetchGroups();
  try {
    if (
      typeof maxSeats.value !== "number" ||
      typeof minSeats.value !== "number"
    )
      return alert("Please enter a number for max and min seats");

    await compareSeatAndPay();

    let groupsCopy: Group[] = Groups.value.map((group) => ({
      groupLeader: { ...group.groupLeader },
      members: group.members.map((member) => ({ ...member })),
    }));

    if (includeUnpaidStudents.value === false) {
      const filteredGroups: Group[] = [];

      for (let groupIndex = 0; groupIndex < groupsCopy.length; groupIndex++) {
        const group = groupsCopy[groupIndex];
        if (!group) continue;

        const filteredMembers: Student[] = [];
        for (
          let memberIndex = 0;
          memberIndex < group.members.length;
          memberIndex++
        ) {
          let isUnpaid = false;
          for (let i = 0; i < notPaid.value.length; i++) {
            if (notPaid.value[i]!.email === group.members[memberIndex]?.email) {
              isUnpaid = true;
              break;
            }
          }
          if (!isUnpaid && group.members[memberIndex]) {
            filteredMembers.push(group.members[memberIndex]!);
          }
        }

        let leaderIsUnpaid = false;
        for (let i = 0; i < notPaid.value.length; i++) {
          if (notPaid.value[i]?.email === group.groupLeader?.email) {
            leaderIsUnpaid = true;
            break;
          }
        }

        if (leaderIsUnpaid) {
          // assigns new GL if the leader is unpaid, don't actually become group leaders, just for displaying data
          if (filteredMembers.length > 0) {
            const newLeader = filteredMembers[0];
            const newMembers = filteredMembers.slice(1);

            if (newLeader) {
              filteredGroups.push({
                groupLeader: {
                  firstName: newLeader.firstName,
                  lastName: newLeader.lastName,
                  email: newLeader.email,
                  osis: newLeader.email, // not OSIS but has to be set for GL
                },
                members: newMembers,
              });
            }
          }
        } else {
          if (group.groupLeader) {
            filteredGroups.push({
              groupLeader: group.groupLeader,
              members: filteredMembers,
            });
          }
        }
      }

      groupsCopy = filteredGroups;
    }

    const allGroupEmails: string[] = [];
    for (let groupIndex = 0; groupIndex < groupsCopy.length; groupIndex++) {
      const group = groupsCopy[groupIndex];
      if (!group) continue;
      if (group.groupLeader?.email)
        allGroupEmails.push(group.groupLeader.email);
      for (
        let memberIndex = 0;
        memberIndex < group.members.length;
        memberIndex++
      ) {
        if (group.members[memberIndex]?.email) {
          allGroupEmails.push(group.members[memberIndex]!.email);
        }
      }
    }

    const extraStudents: ImportedStudent[] = [];
    for (let i = 0; i < noSeat.value.length; i++) {
      if (!allGroupEmails.includes(noSeat.value[i]?.email ?? "")) {
        extraStudents.push(noSeat.value[i]!);
      }
    }

    for (let i = 0; i < extraStudents.length; i++) {
      const student = extraStudents[i];
      if (!student?.name || !student?.email) continue;
      groupsCopy.push({
        groupLeader: {
          firstName: student.name.split(" ")[0] ?? "",
          lastName: student.name.split(" ")[1] ?? "",
          email: student.email,
          osis: student.email, //no OSIS to use for them but need to be displayed
        },
        members: [],
      });
    }

    Tables.value = rangeSort(
      groupsCopy,
      algoFunctionOptions,
      maxSeats.value,
      minSeats.value
    ) as Table[];
  } catch (error: any) {
    alert(error.message);
  }
}
function printTables() {
  if (!(Tables.value.length > 0))
    return alert("Run the table sort before displaying tables.");
  stringArray.value = [];
  Tables.value.forEach((table, i) => {
    let tableString = ``;
    table.occupants.forEach((occupant) => {
      tableString += `${occupant.groupLeader.firstName} ${occupant.groupLeader.lastName}\n`;
      occupant.members.forEach((member) => {
        tableString += `${member.firstName} ${member.lastName}\n`;
      });
    });
    stringArray.value.push(tableString);
  });
}

onMounted(() => {
  // fetchGroups();
});
</script>
