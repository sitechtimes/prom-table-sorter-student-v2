<template>
  <div
    class="min-h-screen bg-gray-200 flex flex-col items-center px-3 sm:px-6 py-8 gap-8"
  >
    <div
      class="w-full max-w-3xl bg-white border border-gray-300 shadow-2xl rounded-2xl p-5 sm:p-6 md:p-8"
    >
      <h1 class="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
        Upload Excel file of those who paid
      </h1>
      <input
        id="upload-file2"
        class="file-input file-input-bordered w-full mb-4"
        type="file"
        ref="paidFile"
        accept=".xlsx"
        @change="compareSeatAndPay"
      />
      <button
        class="btn btn-secondary w-full mb-4"
        @click="showPaidExample = !showPaidExample"
      >
        Click here to open / close example
      </button>
      <img
        v-if="showPaidExample"
        src="../assets/paidExample.png"
        class="mx-auto w-full sm:w-2/3 md:w-1/2 rounded-xl shadow mb-6"
      />
      <h1 class="text-xl sm:text-2xl font-bold text-center text-black mb-4">
        Enter a range for table sizes
      </h1>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <div class="w-full sm:w-32">
          <h2 class="font-semibold text-black text-center mb-1">From</h2>
          <input
            type="number"
            class="input input-bordered w-full"
            v-model.number="minSeats"
          />
        </div>
        <div class="w-full sm:w-32">
          <h2 class="font-semibold text-black text-center mb-1">To</h2>
          <input
            type="number"
            class="input input-bordered w-full"
            v-model.number="maxSeats"
          />
        </div>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-center text-black my-6">
        Students that haven't paid and are at a table
      </h1>
      <div class="mb-6">
        <div
          v-if="notPaid.length !== 0"
          v-for="student in notPaid"
          :key="student.osis"
          class="text-black text-center font-medium mb-1"
        >
          {{ student.firstName }} {{ student.lastName }}
        </div>
        <p v-else class="text-gray-500 text-center italic">
          Empty, enter an excel to display.
        </p>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-center text-black my-6">
        Students that have paid and are not at a table
      </h1>
      <div class="mb-6">
        <div
          v-if="noSeat.length !== 0"
          v-for="student in noSeat"
          :key="student.email"
          class="text-black text-center font-medium mb-1"
        >
          {{ student.name }}
        </div>
        <p v-else class="text-gray-500 text-center italic">
          Empty, enter an excel to display.
        </p>
      </div>
      <a
        v-if="downloadExcelLink == null"
        class="btn w-full mb-4 pointer-events-none opacity-60"
      >
        Enter an excel and sort for a download link
      </a>
      <a v-else :href="downloadExcelLink" class="btn btn-primary w-full mb-4">
        Download Comparison
      </a>
      <div class="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          v-model="includeUnpaidStudents"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Include unpaid students in table sorting
        </label>
      </div>
      <div class="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          v-model="looseMode"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Filter students loosely (name only) or strictly (name and email)
        </label>
      </div>
    </div>
    <button
      class="btn btn-primary w-full max-w-sm"
      v-if="Tables.length == 0"
      @click="executeSort()"
    >
      Sort Tables
    </button>
    <button
      class="btn btn-primary w-full max-w-sm"
      v-else
      @click="executeSort()"
    >
      Refresh Sort
    </button>
    <div v-if="Tables.length > 0" class="w-full flex justify-center px-4">
      <div class="w-full">
        <TableVisualizer :tables="Tables" :key="updateProps" />
      </div>
    </div>
    <button class="btn btn-primary mb-4" @click="fetchGroups">
      Load Groups
    </button>
    <button class="btn btn-primary mb-4" @click="logGroups">Log Groups</button>
  </div>
</template>

<script lang="ts" setup>
import ExcelJS from "exceljs";
const paidFile = ref<HTMLInputElement | null>(null);
const minSeats = ref<number>();
const maxSeats = ref<number>();
const notPaid = ref<Student[]>([]);
const noSeat = ref<ImportedStudent[]>([]);
const includeUnpaidStudents = ref(false);
const looseMode = ref(false);
const downloadExcelLink = ref<string | null>(null);
const Tables = ref<Table[]>([]);
const showPaidExample = ref(false);
const updateProps = ref(0);
const Groups = ref<Group[]>([
  {
    leader: {
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
    leader: {
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
    leader: {
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
    leader: {
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
interface ImportedStudent {
  name: string;
  email: string;
}

async function fetchGroups() {
  try {
    const res = await fetch("/api/allGroups"); //backend
    if (!res.ok) throw Error("couldnt fetch data");
    const data: Group[] = await res.json();
    Groups.value = data;
  } catch (error) {
    alert(error);
  }
}
function logGroups() {
  console.log(Groups.value);
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
  const paidList = await getPaidList();
  if (!paidList) return;
  const groupStudents: Student[] = Groups.value.flatMap((group: Group) => [
    group.leader,
    ...group.members,
  ]);

  if (looseMode.value === true) {
    notPaid.value = groupStudents.filter((groupStudent) => {
      return !paidList.some(
        (paidStudent) =>
          paidStudent.name.toLowerCase() ===
          `${groupStudent.firstName} ${groupStudent.lastName}`.toLowerCase()
      );
    });
    noSeat.value = paidList.filter((paidStudent) => {
      return !groupStudents.some((groupStudent) => {
        return (
          `${groupStudent.firstName} ${groupStudent.lastName}`.toLowerCase() ===
          paidStudent.name.toLowerCase()
        );
      });
    });
  } else {
    const paidEmails = paidList.map((student) => student.email.toLowerCase());
    const groupEmails = groupStudents.map((student) =>
      student.email.toLowerCase()
    );
    notPaid.value = groupStudents.filter(
      (groupStudent) =>
        !paidEmails.includes(groupStudent.email.toLowerCase()) &&
        !paidList.some(
          (paidStudent) =>
            paidStudent.name.toLowerCase() ===
            `${groupStudent.firstName} ${groupStudent.lastName}`.toLowerCase()
        )
    );
    noSeat.value = paidList.filter(
      (paidStudent) =>
        !groupEmails.includes(paidStudent.email.toLowerCase()) &&
        !groupStudents.some(
          (groupStudent) =>
            `${groupStudent.firstName} ${groupStudent.lastName}`.toLowerCase() ===
            paidStudent.name.toLowerCase()
        )
    );
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
    const file = paidFile.value?.files?.[0];
    if (!file) return alert("Please upload a paid list Excel file.");
    await compareSeatAndPay();

    let groupsCopy: Group[] = Groups.value.map((group) => ({
      leader: { ...group.leader },
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
          if (notPaid.value[i]?.email === group.leader?.email) {
            leaderIsUnpaid = true;
            break;
          }
        }

        if (leaderIsUnpaid) {
          //assigns new GL if the leader is unpaid, don't actually become group leaders, just for displaying data
          if (filteredMembers.length > 0) {
            const newLeader = filteredMembers[0];
            const newMembers = filteredMembers.slice(1);

            if (newLeader) {
              filteredGroups.push({
                leader: {
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
          if (group.leader) {
            filteredGroups.push({
              leader: group.leader,
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
      if (group.leader?.email) allGroupEmails.push(group.leader.email);
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
      updateProps.value += 1;
      groupsCopy.push({
        leader: {
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
    exportAsExcel();
  } catch (error: any) {
    alert(error.message);
  }
}
async function exportAsExcel() {
  const exportWorkbook = new ExcelJS.Workbook();
  const sortedWorksheet = exportWorkbook.addWorksheet("Comparison Worksheet");
  sortedWorksheet.getCell("A1").value = "All Tables";
  sortedWorksheet.getCell("B1").value = "Emails";
  sortedWorksheet.getCell("F1").value = "Haven't paid & @ Table";
  sortedWorksheet.getCell("H1").value = "Paid & Not @ Table";

  let tableIndex = 1;
  let rowIndex = tableIndex;
  Tables.value.forEach((table) => {
    sortedWorksheet.getRow(rowIndex).getCell(1).value = `Table ${tableIndex}`;
    tableIndex += 1;
    rowIndex += 1;
    table.occupants.forEach((occupant) => {
      occupant.members.forEach((member) => {
        sortedWorksheet.getRow(rowIndex).getCell(1).value =
          `${member.firstName} ${member.lastName}`;
        sortedWorksheet.getRow(rowIndex).getCell(2).value = member.email;
        rowIndex += 1;
      });
    });
  });

  for (let i = 0; i < notPaid.value.length; i++) {
    sortedWorksheet.getRow(i + 2).getCell(6).value =
      `${notPaid.value[i]?.firstName} ${notPaid.value[i]?.lastName}`;
  }

  for (let i = 0; i < noSeat.value.length; i++) {
    sortedWorksheet.getRow(i + 2).getCell(8).value = noSeat.value[i]?.name;
  }

  const buffer = await exportWorkbook.xlsx.writeBuffer();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const blob = new Blob([buffer], { type: fileType });
  downloadExcelLink.value = URL.createObjectURL(blob);
}

onMounted(() => {
  // fetchGroups();
});
</script>
