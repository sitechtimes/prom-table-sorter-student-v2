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
      :class="comparisonOpen ? 'lg:w-[calc(100%-420px)]' : 'w-full'"
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
              @change="moveable(tables[i])"
              class="space-y-2 min-h-[32px]"
              :forceFallback="true"
              :fallbackOnBody="true"
              handle=".drag-handle"
            >
              <template #item="{ element: group, index }">
                <div
                  class="border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs relative"
                  ref="groupBoxes"
                >
                  <div
                    class="drag-handle cursor-move flex items-center justify-center gap-1 py-1 text-gray-400 hover:text-gray-600 border-b border-gray-200 select-none"
                  >
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                      <circle cx="3" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="13" cy="2" r="1.5"/>
                      <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
                    </svg>
                  </div>
                  <div class="p-2">
                    <div class="text-gray-700 font-semibold mb-1">
                      Group Size: {{ group.members.length + 1 }}
                    </div>
                    <div
                      v-if="group.preferredNeighbor"
                      class="text-blue-600 text-[10px] mb-1 truncate"
                      :title="'Wants next to: ' + group.preferredNeighbor"
                    >
                      → {{ group.preferredNeighbor }}
                    </div>
                    <div class="relative">
                      <button
                        class="btn btn-xs btn-outline bg-white text-gray-800 border-gray-400 hover:bg-gray-200"
                        @click.stop="
                          toggleDropdown({
                            tableIndex: i,
                            groupIndex: index,
                            event: $event,
                          })
                        "
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
                          class="absolute z-50 bg-white border rounded-md shadow max-h-48 overflow-y-auto text-xs text-gray-700"
                          :style="dropdownPosition"
                        >
                          <li
                            v-if="group.preferredNeighbor"
                            class="px-2 py-1 bg-blue-50 border-b border-blue-100"
                          >
                            <span class="font-bold text-blue-700">Wants next to:</span>
                            <span class="ml-1 text-blue-600">{{ group.preferredNeighbor }}</span>
                          </li>
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
                </div>
              </template>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="selectedTables.length"
      class="w-full lg:w-[420px] bg-white border border-gray-300 rounded-xl shadow-lg p-4 space-y-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
    >
      <h3 class="text-lg font-bold text-gray-800">Selected Tables</h3>
      <h4 class="text-sm italic text-gray-500">
        Click "Manage Table" on any table to add it here
      </h4>
      <div
        v-for="tableIndex in selectedTables"
        :key="tableIndex"
        class="border border-gray-300 rounded-lg bg-gray-50 p-3"
      >
        <div class="flex justify-between items-center mb-2">
          <div>
            <h4 class="font-semibold text-gray-800">Table {{ tableIndex + 1 }}</h4>
            <p class="text-[11px] text-gray-500">
              {{ tables[tableIndex]!.capacity - tables[tableIndex]!.unoccupiedSeats }} /
              {{ tables[tableIndex]!.capacity }} seats filled
            </p>
          </div>
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
          class="space-y-2 max-h-[200px] overflow-y-auto min-h-[32px]"
          @change="moveable(tables[tableIndex]!)"
          :forceFallback="true"
          :fallbackOnBody="true"
          handle=".drag-handle"
        >
          <template #item="{ element: group }">
            <div
              class="border border-gray-300 rounded bg-white text-xs text-gray-800"
            >
              <div
                class="drag-handle cursor-move flex items-center justify-center py-1 text-gray-400 hover:text-gray-600 border-b border-gray-100 select-none"
              >
                <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                  <circle cx="3" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="13" cy="2" r="1.5"/>
                  <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
                </svg>
              </div>
              <div class="px-2 py-1 flex justify-between items-start gap-1">
                <div class="min-w-0">
                  <span class="font-semibold block truncate">
                    {{ group.leader.firstName }} {{ group.leader.lastName }}
                  </span>
                  <span
                    v-if="group.preferredNeighbor"
                    class="text-blue-600 text-[10px] block truncate"
                  >
                    → {{ group.preferredNeighbor }}
                  </span>
                </div>
                <span
                  class="shrink-0 text-gray-600 text-[10px] px-1 bg-gray-200 rounded-full"
                >{{ group.members.length + 1 }}</span>
              </div>
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
type dropdownInput = {
  tableIndex: number;
  groupIndex: number;
  event: MouseEvent;
};

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
function toggleDropdown({ tableIndex, groupIndex, event }: dropdownInput) {
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
function closeDropdown() {
  openDropdown.value = null;
}
onMounted(() => window.addEventListener("click", closeDropdown));
onUnmounted(() => window.removeEventListener("click", closeDropdown));

function moveable(table: Table | undefined) {
  if (table == undefined) return;
  const totalSeats = table.occupants.reduce(
    (sum: number, group: Group) => sum + group.members.length + 1,
    0
  );
  const tableCapacity = table!.capacity;
  if (!(totalSeats <= tableCapacity)) alert("Too many students at one table");
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
  else selectedTables.value.push(index);
}
function removeSelected(index: number) {
  selectedTables.value = selectedTables.value.filter((i) => i !== index);
}
</script>
