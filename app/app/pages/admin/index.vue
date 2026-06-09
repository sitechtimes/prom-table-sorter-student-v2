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
        :src="paidExample"
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
      <details
        class="group mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-lg sm:text-xl font-bold text-slate-900 hover:bg-slate-50"
        >
          <span
            >Students that haven't paid and are registered ({{
              notPaid.length
            }})</span
          >
          <span class="text-sm font-medium text-slate-500 group-open:hidden"
            >Click to open</span
          >
          <span
            class="hidden text-sm font-medium text-slate-500 group-open:inline"
            >Click to close</span
          >
        </summary>
        <div class="border-t border-slate-200 bg-slate-50 px-5 py-5">
          <div
            v-if="notPaid.length !== 0"
            class="max-h-80 space-y-3 overflow-y-auto"
          >
            <div
              v-for="student in notPaid"
              :key="student.osis || student.email"
              class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm"
            >
              <div class="text-base font-semibold">
                {{ student.firstName }} {{ student.lastName }}
              </div>
              <div class="text-sm text-slate-500">
                {{ student.email }}
              </div>
            </div>
          </div>
          <p v-else class="text-center italic text-slate-500">
            Empty, enter an excel to display.
          </p>
        </div>
      </details>
      <details
        class="group mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-lg sm:text-xl font-bold text-slate-900 hover:bg-slate-50"
        >
          <span
            >Students that have paid and aren't registered ({{
              notRegistered.length
            }})</span
          >
          <span class="text-sm font-medium text-slate-500 group-open:hidden"
            >Click to open</span
          >
          <span
            class="hidden text-sm font-medium text-slate-500 group-open:inline"
            >Click to close</span
          >
        </summary>
        <div class="border-t border-slate-200 bg-slate-50 px-4 py-4">
          <div
            v-if="notRegistered.length !== 0"
            class="max-h-64 space-y-2 overflow-y-auto"
          >
            <div
              v-for="student in notRegistered"
              :key="student.email"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm"
            >
              <div class="font-semibold">{{ student.name }}</div>
              <div class="text-xs text-slate-500">
                {{ student.email }}
              </div>
            </div>
          </div>
          <p v-else class="text-center italic text-slate-500">
            Empty, enter an excel to display.
          </p>
        </div>
      </details>
      <details
        class="group mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-lg sm:text-xl font-bold text-slate-900 hover:bg-slate-50"
        >
          <span>Guests and guest owners ({{ guestPairs.length }})</span>
          <span class="text-sm font-medium text-slate-500 group-open:hidden"
            >Click to open</span
          >
          <span
            class="hidden text-sm font-medium text-slate-500 group-open:inline"
            >Click to close</span
          >
        </summary>
        <div class="border-t border-slate-200 bg-slate-50 px-4 py-4">
          <div v-if="guestPairs.length !== 0" class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white text-left text-sm text-slate-800 shadow-sm"
            >
              <thead class="bg-slate-100 text-slate-700">
                <tr>
                  <th class="px-4 py-3 font-semibold">Guest owner</th>
                  <th class="px-4 py-3 font-semibold">Guest</th>
                  <th class="px-4 py-3 font-semibold">Paid count</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr
                  v-for="pair in guestPairs"
                  :key="pair.owner.email + pair.guest.email"
                >
                  <td class="px-4 py-3">
                    <div class="font-medium text-slate-900">
                      {{ pair.owner.firstName }} {{ pair.owner.lastName }}
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ pair.owner.email }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-slate-900">
                      {{ pair.guest.firstName }} {{ pair.guest.lastName }}
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ pair.guest.email }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="
                        pair.paidCount === 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      "
                    >
                      {{ pair.paidCount }}/2
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-center italic text-slate-500">
            Empty, enter an excel to display.
          </p>
        </div>
      </details>
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
      <div class="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          v-model="includeUnregisteredStudents"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Include paid but unregistered students in table sorting
        </label>
      </div>
      <div class="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          v-model="looseMode"
          class="checkbox checkbox-primary"
        />
        <label class="text-black font-medium">
          Filter students loosely (name only)
        </label>
        <h4 class="text-black font-small">
          (Filtering strictly uses both name & email)
        </h4>
      </div>
    </div>
    <button
      class="btn btn-primary w-full max-w-sm"
      v-if="tables.length == 0"
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
    <div v-if="tables.length > 0" class="w-full flex justify-center px-4">
      <div class="w-full">
        <TableVisualizer
          :tables="tables"
          :notPaid="notPaid"
          :notRegistered="notRegistered"
          :key="updateProps"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import paidExample from "~/assets/paidExample.png";
import ExcelJS from "exceljs";
definePageMeta({
  middleware: "auth",
});

const paidFile = ref<HTMLInputElement | null>(null);
const minSeats = ref<number>();
const maxSeats = ref<number>();
const notPaid = ref<Student[]>([]);
const notRegistered = ref<ImportedStudent[]>([]);
const includeUnpaidStudents = ref(false);
const includeUnregisteredStudents = ref(false);
const looseMode = ref(false);
const tables = ref<Table[]>([]);
const showPaidExample = ref(false);
const updateProps = ref(0);
const Groups = ref<Group[]>();
const guestPairs = ref<
  Array<{
    owner: Student;
    guest: Student;
    paidCount: number;
  }>
>([]);

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function cellValueToText(value: unknown) {
  if (value == null) return "";

  if (typeof value === "object") {
    const typedValue = value as {
      text?: unknown;
      result?: unknown;
      richText?: Array<{ text?: string }>;
    };

    if (typeof typedValue.text === "string") return typedValue.text;
    if (typeof typedValue.result === "string") return typedValue.result;
    if (Array.isArray(typedValue.richText)) {
      return typedValue.richText.map((part) => part.text ?? "").join("");
    }
  }

  return String(value);
}

function normalizeCellText(value: unknown) {
  return cellValueToText(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function getStudentName(student: Student) {
  return `${student.firstName} ${student.lastName}`.trim();
}

function matchesPaidEntry(student: Student, paidStudent: ImportedStudent) {
  const studentName = normalizeCellText(getStudentName(student));
  const studentEmail = normalizeCellText(student.email);
  const paidName = normalizeCellText(paidStudent.name);
  const paidEmail = normalizeCellText(paidStudent.email);

  if (looseMode.value === true) {
    return paidName === studentName;
  }

  return paidEmail === studentEmail || paidName === studentName;
}

function countStudentPayments(student: Student, paidList: ImportedStudent[]) {
  return paidList.reduce(
    (count, paidStudent) =>
      count + (matchesPaidEntry(student, paidStudent) ? 1 : 0),
    0,
  );
}

function isStudentPaid(student: Student, paidList: ImportedStudent[]) {
  return countStudentPayments(student, paidList) > 0;
}

function buildGuestPairs(
  groupStudents: Student[],
  paidList: ImportedStudent[],
) {
  const pairedGuests = groupStudents.filter((student) => student.isGuest);
  const pairs: Array<{
    owner: Student;
    guest: Student;
    paidCount: number;
  }> = [];

  for (const guest of pairedGuests) {
    const ownerEmail = normalizeText(guest.guestOwner ?? "");
    const owner = groupStudents.find(
      (student) =>
        !student.isGuest && normalizeText(student.email) === ownerEmail,
    );

    if (!owner) continue;

    const ownerPaid = countStudentPayments(owner, paidList);
    const guestPaid = countStudentPayments(guest, paidList);

    pairs.push({
      owner,
      guest,
      paidCount: Math.min(2, ownerPaid + guestPaid),
    });
  }

  return pairs;
}

function refreshGuestPairsFromGroups(paidList: ImportedStudent[] = []) {
  if (!Groups.value) {
    guestPairs.value = [];
    return;
  }

  const groupStudents: Student[] = Groups.value.flatMap((group: Group) => [
    group.leader,
    ...group.members,
  ]);

  guestPairs.value = buildGuestPairs(groupStudents, paidList);
}

async function fetchGroups() {
  try {
    const res = await fetch("/api/allGroups"); //backend
    if (!res.ok) throw Error("couldnt fetch data");
    const data: Group[] = await res.json();
    Groups.value = data;
    refreshGuestPairsFromGroups();
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
      const name = cellValueToText(paidSheet.getCell(`A${i}`).value).trim();
      const email = cellValueToText(paidSheet.getCell(`B${i}`).value).trim();
      if (name && email) {
        paidList.push({ name, email });
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
  if (!Groups.value) return;
  const groupStudents: Student[] = Groups.value.flatMap((group: Group) => [
    group.leader,
    ...group.members,
  ]);
  const nonGuestStudents = groupStudents.filter((student) => !student.isGuest);

  if (looseMode.value === true) {
    notPaid.value = nonGuestStudents.filter((groupStudent) => {
      return !isStudentPaid(groupStudent, paidList);
    });
    notRegistered.value = paidList.filter((paidStudent) => {
      return !groupStudents.some(
        (groupStudent) =>
          normalizeText(
            `${groupStudent.firstName} ${groupStudent.lastName}`,
          ) === normalizeText(paidStudent.name),
      );
    });
  } else {
    const paidEmails = paidList.map((student) => student.email.toLowerCase());
    const groupEmails = groupStudents.map((student) =>
      student.email.toLowerCase(),
    );
    notPaid.value = nonGuestStudents.filter(
      (groupStudent) =>
        !paidEmails.includes(groupStudent.email.toLowerCase()) &&
        !isStudentPaid(groupStudent, paidList),
    );
    notRegistered.value = paidList.filter(
      (paidStudent) =>
        !groupEmails.includes(paidStudent.email.toLowerCase()) &&
        !groupStudents.some(
          (groupStudent) =>
            normalizeText(
              `${groupStudent.firstName} ${groupStudent.lastName}`,
            ) === normalizeText(paidStudent.name),
        ),
    );
  }
  refreshGuestPairsFromGroups(paidList);
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
    if (!Groups.value) return;
    let groupsCopy: Group[] = Groups.value.map((group) => ({
      leader: { ...group.leader },
      members: group.members.map((member) => ({ ...member })),
      preferredNeighbor: group.preferredNeighbor,
    }));

    if (includeUnpaidStudents.value === false) {
      const filteredGroups: Group[] = [];
      const unpaidEmailSet = new Set(
        notPaid.value.map((student) => normalizeText(student.email)),
      );

      for (let groupIndex = 0; groupIndex < groupsCopy.length; groupIndex++) {
        const group = groupsCopy[groupIndex];
        if (!group) continue;

        const filteredMembers: Student[] = [];
        for (
          let memberIndex = 0;
          memberIndex < group.members.length;
          memberIndex++
        ) {
          const member = group.members[memberIndex];
          if (!member) continue;

          // Keep guests out of paid-only sorting when their owner is unpaid.
          if (
            member.isGuest &&
            unpaidEmailSet.has(normalizeText(member.guestOwner ?? ""))
          ) {
            continue;
          }

          const isUnpaid = unpaidEmailSet.has(normalizeText(member.email));
          if (!isUnpaid) {
            filteredMembers.push(member);
          }
        }

        const leaderIsUnpaid = unpaidEmailSet.has(
          normalizeText(group.leader?.email ?? ""),
        );

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
                preferredNeighbor: group.preferredNeighbor,
              });
            }
          }
        } else {
          if (group.leader) {
            filteredGroups.push({
              leader: group.leader,
              members: filteredMembers,
              preferredNeighbor: group.preferredNeighbor,
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

    if (includeUnregisteredStudents.value) {
      const extraStudents: ImportedStudent[] = [];
      for (let i = 0; i < notRegistered.value.length; i++) {
        if (!allGroupEmails.includes(notRegistered.value[i]?.email ?? "")) {
          extraStudents.push(notRegistered.value[i]!);
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
    }

    tables.value = rangeSort(
      groupsCopy,
      algoFunctionOptions,
      maxSeats.value,
      minSeats.value,
    ) as Table[];
  } catch (error: any) {
    alert(error.message);
  }
}
onMounted(() => {
  fetchGroups();
});
</script>
