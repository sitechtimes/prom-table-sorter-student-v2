<template>
  <!--Needs to actually edit the array with each drag and drop-->
  <!--Also needs to only be addable to the group if the number of students is less than the unoccupied seats-->
  <div>
    <div id="grid" class="row">
      <h4 class="col-12">Grid Example</h4>
      <div v-for="(table, i) in tables" :key="i" id="gridDemo" class="col">
        <div class="grid-square">
          <div id="nestedDemo" class="list-group col nested-sortable droppable">
            <div class="list-group-item nested-1">
              <h2>Free seats: {{ table.unoccupiedSeats }}</h2>
              <div
                v-for="(group, j) in table.occupants"
                :key="j"
                class="list-group nested-sortable group"
              >
                <div class="list-group-item nested-2">
                  <h2>
                    {{ group.groupLeader.firstName }}
                    {{ group.groupLeader.lastName }}'s Group
                  </h2>
                  <h3>
                    Number of Students in Group:
                    {{ group.members.length + 1 }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn" @click="printTables">List Tables:</button>
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
import Sortable from "sortablejs";
Sortable.mount(new MultiDrag(), new Swap());

const props = defineProps({
  tables: {
    type: Array,
    required: true,
  },
});
const tables = computed(() => props.tables); //required to mutate props array

onMounted(() => {
  document.querySelectorAll(".droppable").forEach((el) => {
    new Sortable(el, {
      group: {
        name: "groups",
        pull: true,
        put: (to) => {
          return to.classList.contains("table-droppable");
        },
      },
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
    });
  });
});

function printTables() {
  if (!(tables.value.length > 0))
    return alert("Run the table sort before displaying tables.");
  stringArray.value = [];
  tables.value.forEach((table) => {
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
const nestedSortables = ref([]);
for (var i = 0; i < nestedSortables.value.length; i++) {
  new Sortable(nestedSortables.value[i], {
    group: "nested",
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
  });
}
</script>
