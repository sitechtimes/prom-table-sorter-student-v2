<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Student Form
      </h1>
      <form @submit.prevent="submit">
        <FormInput
          category="First Name"
          color="black"
          v-model="groupLeader.firstName"
          type="text"
          placeholder="Enter here"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="groupLeader.lastName"
          type="text"
          placeholder="Enter here"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="NYC Students Email"
          color="black"
          v-model="groupLeader.email"
          type="email"
          placeholder="examples@nycstudents.net"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="OSIS"
          color="black"
          v-model="groupLeader.osis"
          type="text"
          placeholder="123456789"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <h2 class="text-black text-lg font-semibold">
          Are you registering for a group?
        </h2>
        <input
          type="checkbox"
          v-model="InGroup"
          class="checkbox checkbox-primary mb-4"
          @change="clearGroup()"
        />

        <div v-if="InGroup" class="mb-6">
          <h2 class="text-black text-lg font-semibold">
            How many people are in your group? (up to 12 including yourself)
          </h2>
          <div class="w-full max-w-xs text-black">
            <input
              type="range"
              min="2"
              max="12"
              class="range range-primary"
              step="1"
              v-model.number="GroupSize"
              @input="organizeGroup()"
            />
            <div class="flex justify-between px-2.5 mt-2 text-xs">
              <span v-for="i in 11">|</span>
            </div>
          </div>
          <h3 class="text-black font-semibold text-center mt-4">
            Group Size: {{ GroupSize }}
          </h3>
        </div>

        <div v-if="InGroup" class="mt-6 space-y-3">
          <div
            v-for="i in GroupSize - 1"
            class="collapse collapse-arrow bg-base-100 border border-base-300 space-y-2"
          >
            <input type="radio" :name="'group-accordion'" :checked="i === 1" />
            <div class="collapse-title font-semibold">Member {{ i + 1 }}</div>
            <div class="collapse-content text-sm space-y-2">
              <FormInput
                category="First Name"
                color="white"
                v-model="Group[i]!.firstName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
              <FormInput
                category="Last Name"
                color="white"
                v-model="Group[i]!.lastName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
              <FormInput
                category="NYC Students Email"
                color="white"
                v-model="Group[i]!.email"
                type="email"
                placeholder="examples@nycstudents.net"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full mt-6">
          Submit Form
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {navigateTo} from '#app';


const groupLeader = reactive<Student>({
  firstName: "",
  lastName: "",
  email: "",
  osis: "",
});
const InGroup = ref(false);
const GroupSize = ref(1);
const Group = ref<Student[]>([groupLeader]);

// error handling for if students fail validation/duplicate checks
const failedIndexes = ref<number[]>([]);
function hasError(index: number) {
  return failedIndexes.value.includes(index);
}


function organizeGroup() {
  if (!InGroup.value) {
    Group.value = [groupLeader];
    return;
  }
  for (let i = Group.value.length; i < GroupSize.value; i++) {
    Group.value.push({ firstName: "", lastName: "", email: "" });
    Group.value[0] = groupLeader;
  }
}
function clearGroup() {
  if (InGroup.value) {
    GroupSize.value = 2;
    organizeGroup();
  } else {
    GroupSize.value = 1;
    Group.value = [groupLeader];
  }
}

async function submit() {
  const dataPush = {
    leader: groupLeader,
    members: Group.value.slice(1),
  };
  console.log(dataPush)

  const osisCheck =
    (groupLeader.osis as string).length === 9 &&
    !isNaN(Number(groupLeader.osis));
  const emailCheck = groupLeader.email.includes("@nycstudents.net");

  if (!osisCheck || !emailCheck) {
    alert("Enter a 9 digit OSIS and an @nycstudents.net email");
    return;
  }
  try {
    const res = await fetch("/api/createGroup", {
      //push data here (using backend)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPush),
    });
    const data = await res.json();
    failedIndexes.value = [];
    if (!res.ok) {
      failedIndexes.value = data.data.failedIndexes;
      alert(data.message);
    } else {
      alert("Submission successful!");
      await navigateTo('/')
    }
  } catch (err) {
    alert("couldnt push data to mongodb");
    console.log(err);
  }
}

</script>
