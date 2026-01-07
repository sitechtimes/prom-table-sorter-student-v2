<template>
  <!--Needs to actually edit the array with each drag and drop-->
  <!--Also needs to only be addable to the group if the number of students is less than the unoccupied seats-->
  <!--Move excel export into here too after merging with main-->
  <div>
    <div class="row">
      <div v-for="(table, tableIndex) in tables" :key="tableIndex" class="col">
        <div class="grid-square">
          <h4>Free seats: {{ table.unoccupiedSeats }}</h4>
          <draggable
            v-model="table.occupants"
            group="groups"
            item-key="id"
            animation="150"
            class="list-group"
          >
            <template #item="{ element: group }">
              <div class="list-group-item group">
                <h2>
                  {{ group.groupLeader.firstName }}
                  {{ group.groupLeader.lastName }}'s Group
                </h2>

                <h3>
                  Number of Students in Group:
                  {{ group.members.length + 1 }}
                </h3>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <button class="btn" @click="printTables">List Tables</button>
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
</template>

<script setup>
import { VueDraggableNext as draggable } from "vue-draggable-next";

const props = defineProps({
  tables: {
    type: Array,
    required: true,
  },
  stringArray: {
    type: Array,
    required: true,
  },
});
const tables = computed(() => props.tables); //required to mutate props array

function printTables() {
  props.stringArray.length = 0;
  tables.value.forEach((table) => {
    let tableString = ``;
    table.occupants.forEach((occupant) => {
      tableString += `${occupant.groupLeader.firstName} ${occupant.groupLeader.lastName}\n`;
      occupant.members.forEach((member) => {
        tableString += `${member.firstName} ${member.lastName}\n`;
      });
    });
    props.stringArray.push(tableString);
  });
}
</script>
