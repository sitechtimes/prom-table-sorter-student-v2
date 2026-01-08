<template>
  <div class="space-y-6">
    <div
      v-for="(table, i) in tables"
      :key="i"
      class="p-4 bg-white rounded-xl shadow"
    >
      <h4 class="text-lg font-semibold text-gray-700 mb-2">
        Free seats: {{ table.unoccupiedSeats }}
      </h4>

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
//next to work on: display name and email as well as make it so free seats left updates on the table
import Draggable from "vuedraggable-esm";
const props = defineProps<{
  tables: Table[];
}>();

const tables = props.tables;

function moveable(
  evt: { draggedContext: { element: any }; relatedContext: { list: any } },
  table: Table
) {
  const group = evt.draggedContext.element;
  const list = evt.relatedContext.list;

  const remainingSeats = list.reduce(
    (acc: number, group: Group) => acc - (group.members.length + 1),
    table.capacity
  );
  table.occupants = remainingSeats;
  //members randomly disappear when moving sometimes
  //needs to lock at least one student to each table in order to prevent errors
  //potential option to remove a table?
  //maybe make it moveable but an alert will pop up indicating the table size is beyond capacity
  return group.members.length + 1 <= remainingSeats;
}
</script>
