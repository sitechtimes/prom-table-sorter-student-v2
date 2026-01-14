<template>
  <div class="space-y-6">
    <button class="btn" @click="addTable(tables[0]!.capacity)">
      Add Table
    </button>
    <div
      v-for="(table, i) in tables"
      :key="i"
      class="p-4 bg-white rounded-xl shadow"
    >
      <div>
        <button class="btn btn-red-600" @click="removeTable(table, i)">
          Remove Table
        </button>
      </div>
      <h4 class="text-lg font-bold text-gray-700 mb-3">Table: {{ i }}</h4>
      <h5 class="text-md font-semibold text-gray-700 mb-2" :key="i">
        Free seats: {{ table.unoccupiedSeats }}

      <Draggable
        v-model="table.occupants"
        :group="{ name: 'groups', pull: true, put: true }"
        item-key="groupLeader.osis"
        :move="
          (action: {
            draggedContext: { element: any };
            relatedContext: { list: any };
          }) => moveable(action, table)
        "
        class="space-y-2"
      >
        <template #item="{ element: group }">
          <div
            class="p-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-move"
          >
            <div class="font-medium text-gray-800">
              {{ group.groupLeader.firstName }} {{ group.groupLeader.lastName }}
            </div>
            <div class="text-sm text-gray-500">
              Members: {{ group.members.length }}
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
//next to work on: display name and email (basically just use dropdown from the other table) as well as make it so free seats left updates on the table
//fix styling
//potentially group together all the single student groups for better visibility with large amounts of table. IDEA: MAKE EACH TABLE A DROP DOWN
import Draggable from "vuedraggable-esm";
const props = defineProps<{
  tables: Table[];
}>();

const tables = props.tables;
function moveable(
  evt: {
    draggedContext: { element: Group };
    relatedContext: { list: Group[] };
  },
  table: Table
): boolean {
  const group = evt.draggedContext.element;

  const incomingSeats = group.members.length + 1;

  const occupiedAfterIncomingGroup = evt.relatedContext.list.reduce(
    (sum, group) => sum + group.members.length + 1,
    0
  );

  const remainingSeats = table.capacity - occupiedAfterIncomingGroup;

  return incomingSeats <= remainingSeats;
  //potential option to remove a table?
  //maybe make it moveable but an alert will pop up indicating the table size is beyond capacity
}
function addTable(tableCapacity: number) {
  tables.push({
    capacity: tableCapacity,
    unoccupiedSeats: tableCapacity,
    occupants: [],
  });
}
function removeTable(table: Table, tableIndex: number) {
  if (table.occupants.length == 0) {
    tables.splice(tableIndex, 1);
  } else {
    alert("Can not remove table unless the table is empty");
  }
}
</script>
