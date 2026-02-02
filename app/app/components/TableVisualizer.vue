<template>
  <div class="flex items-center justify-center">
    <ExcelExport
      :tables="tables"
      :notPaid="notPaid"
      :notRegistered="notRegistered"
    />
  </div>

  <div
    class="flex flex-col lg:flex-row lg:flex-nowrap w-full px-4 sm:px-6 py-6 gap-6"
  >
    <div
      class="min-w-0 transition-all duration-300"
      :class="comparisonOpen ? 'lg:w-[calc(100%-360px)]' : 'w-full'"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Table Layout</h2>
        <button class="btn btn-primary" @click="addTable(tables[0]!.capacity)">
          + Add Table
        </button>
      </div>
      <div
        class="grid gap-6 items-start justify-start w-full transition-all duration-300"
        :class="
          comparisonOpen
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        "
      >
        <div
          v-for="(table, i) in tables"
          :key="i"
          class="bg-white rounded-2xl shadow-lg border border-gray-300 w-[300px] h-[300px] flex flex-col relative ring-offset-2 overflow-visible rounded-lg"
          :class="selectedTables.includes(i) ? 'ring-2 ring-purple-500' : ''"
        >
          <div
            class="p-3 border-b flex items-start justify-between"
            :class="table.overCapacity ? 'bg-red-50' : 'bg-gray-100'"
          >
            <div>
              <h4 class="font-bold text-gray-800">Table {{ i + 1 }}</h4>
              <p
                v-if="!table.overCapacity"
                class="text-xs font-medium text-gray-700"
              >
                Students @ table: {{ table.capacity - table.unoccupiedSeats }}
              </p>
              <p
                v-if="!table.overCapacity"
                class="text-xs font-medium text-gray-700"
              >
                Free seats: {{ table.unoccupiedSeats }}
              </p>
              <p v-else class="text-xs font-bold text-red-600">
                Over capacity by {{ Math.abs(table.unoccupiedSeats) }}
              </p>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <button
                class="btn btn-xs btn-outline bg-white text-gray-800 border-gray-400 hover:bg-gray-200"
                @click="displayTable(i)"
              >
                Manage Table
              </button>
              <button
                class="btn btn-xs btn-error"
                @click="removeTable(table, i)"
              >
                Remove
              </button>
            </div>
          </div>
          <div
            v-if="table.overCapacity"
            class="px-2 py-1 text-[11px] font-bold text-red-700 bg-red-100 text-center"
          >
            TABLE BEYOND CAPACITY
          </div>
          <div class="flex-1 p-2 space-y-2 bg-white overflow-y-auto">
            <Draggable
              v-model="table.occupants"
              :group="{ name: 'groups', pull: true, put: true }"
              item-key="leader.osis"
              :move="(evt: any) => moveable(evt, table)"
              class="space-y-2"
            >
              <template #item="{ element: group, index }">
                <div
                  class="p-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs cursor-move relative"
                  ref="groupBoxes"
                >
                  <div class="text-gray-700 font-semibold mb-1">
                    Group Size: {{ group.members.length + 1 }}
                  </div>
                  <div class="relative">
                    <button
                      class="btn btn-xs btn-outline bg-white text-gray-800 border-gray-400 hover:bg-gray-200"
                      @click.stop="toggleDropdown(i, index, $event)"
                    >
                      {{ group.leader.firstName }}
                      {{ group.leader.lastName }}
                    </button>
                    <teleport to="body">
                      <ul
                        v-if="
                          openDropdown?.tableIndex === i &&
                          openDropdown?.groupIndex === index
                        "
                        class="absolute z-50 bg-white border rounded-md shadow max-h-40 overflow-y-auto text-xs text-gray-700"
                        :style="dropdownPosition"
                      >
                        <li class="font-bold mb-1 px-2 py-1">Group Members:</li>
                        <li
                          v-for="member in group.members"
                          :key="member.email"
                          class="italic text-gray-600 px-2 py-1"
                        >
                          {{ member.firstName }} {{ member.lastName }}:
                          {{ member.email }}
                        </li>
                        <li
                          v-if="group.members.length === 0"
                          class="italic text-gray-600 px-2 py-1"
                        >
                          Singular student, no members
                        </li>
                      </ul>
                    </teleport>
                  </div>
                </div>
              </template>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="selectedTables.length"
      class="w-full lg:w-[360px] bg-white border border-gray-300 rounded-xl shadow-lg p-4 space-y-4"
    >
      <h3 class="text-lg font-bold text-gray-800">Selected Tables</h3>
      <h4 class="text-md italic text-gray-600 underline">
        *Only 2 tables at once*
      </h4>
      <div
        v-for="tableIndex in selectedTables"
        :key="tableIndex"
        class="border border-gray-300 rounded-lg bg-gray-50 p-3"
      >
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-gray-800">
            Table {{ tableIndex + 1 }}
          </h4>
          <button
            class="btn btn-xs btn-error"
            @click="removeSelected(tableIndex)"
          >
            ✕
          </button>
        </div>
        <Draggable
          v-model="tables[tableIndex]!.occupants"
          :group="{ name: 'groups', pull: true, put: true }"
          item-key="leader.osis"
          v-if="tables[tableIndex]"
          :move="(evt: any) => moveable(evt, tables[tableIndex])"
          class="space-y-2 max-h-[200px] overflow-y-auto"
        >
          <template #item="{ element: group }">
            <div
              class="p-2 border border-gray-300 rounded bg-white text-xs cursor-move text-gray-800 flex justify-between items-center"
            >
              <span class="font-semibold"
                >{{ group.leader.firstName }} {{ group.leader.lastName }}</span
              >
              <span
                class="text-gray-600 text-[10px] px-1 bg-gray-200 rounded-full"
                >{{ group.members.length + 1 }}</span
              >
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable-esm";

const props = defineProps<{
  tables: Table[];
  notPaid: Student[];
  notRegistered: ImportedStudent[];
}>();
const tables = props.tables;
const selectedTables = ref<number[]>([]);
const openDropdown = ref<{ tableIndex: number; groupIndex: number } | null>(
  null
);
const dropdownPosition = reactive<{ top: string; left: string }>({
  top: "0px",
  left: "0px",
});
const comparisonOpen = computed(() => selectedTables.value.length > 0);

watch(
  tables,
  (tables) => {
    tables.forEach((table) => {
      const occupiedSeats = table.occupants.reduce(
        (sum, group) => sum + group.members.length + 1,
        0
      );
      table.unoccupiedSeats = table.capacity - occupiedSeats;
      table.overCapacity = occupiedSeats > table.capacity;
    });
  },
  { deep: true }
);

//below for drop to work with scrolling
function toggleDropdown(
  tableIndex: number,
  groupIndex: number,
  event: MouseEvent
) {
  event.stopPropagation();
  const groupLeader = event.currentTarget as HTMLElement;
  const rect = groupLeader.getBoundingClientRect();
  dropdownPosition.top = `${rect.bottom + window.scrollY}px`;
  dropdownPosition.left = `${rect.left + window.scrollX}px`;
  if (
    openDropdown.value?.tableIndex === tableIndex &&
    openDropdown.value?.groupIndex === groupIndex
  ) {
    openDropdown.value = null;
  } else {
    openDropdown.value = { tableIndex, groupIndex };
  }
}
window.addEventListener("click", () => {
  openDropdown.value = null;
});

function moveable(evt: any, table: Table | undefined) {
  if (table == undefined) return false;
  const group = evt.draggedContext.element;
  if (evt.relatedContext.list === table.occupants) {
    return false;
  }
  const incomingSeats = group.members.length + 1;
  const occupiedAfterIncomingGroup = evt.relatedContext.list.reduce(
    (sum: number, group: Group) => sum + group.members.length + 1,
    0
  );
  const remainingSeats = table.capacity - occupiedAfterIncomingGroup;
  if (!(incomingSeats <= remainingSeats))
    alert("Too many students at one table");

  return true;
}
function addTable(tableCapacity: number) {
  tables.push({
    capacity: tableCapacity,
    unoccupiedSeats: tableCapacity,
    occupants: [],
    overCapacity: false,
  });
}
function removeTable(table: Table, tableIndex: number) {
  if (table.occupants.length == 0) tables.splice(tableIndex, 1);
  else alert("Can not remove table unless the table is empty");
}
function displayTable(index: number) {
  if (selectedTables.value.includes(index))
    selectedTables.value = selectedTables.value.filter((i) => i !== index);
  else if (selectedTables.value.length < 2) selectedTables.value.push(index);
}
function removeSelected(index: number) {
  selectedTables.value = selectedTables.value.filter((i) => i !== index);
}
</script>
