<template>
  <NuxtLink
      @click="edittingForm = true"
      v-if="!edittingForm"
      to="/StudentEdit"
      class="absolute right-3.5 top-3.5 bg-base-200 rounded shadow hover:bg-warning transition px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base"
    >
      <span class="md:hidden">Edit</span>
      <span class="hidden md:inline"> Want to edit a form? Click here </span>
    </NuxtLink>
  <div class="flex justify-center items-center bg-base-200 p-6">
    <div
      class="card w-full border border-black max-w-md bg-base-100 shadow-xl p-6 cursor-default"
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
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="groupLeader.lastName"
          type="text"
          placeholder="Enter here"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="NYC Students Email"
          color="black"
          v-model="groupLeader.email"
          type="email"
          placeholder="examples@nycstudents.net"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="OSIS"
          color="black"
          v-model="groupLeader.osis"
          type="text"
          placeholder="123456789"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
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
            :key="i"
            class="collapse collapse-arrow bg-base-100 border border-base-300 space-y-2"
          >
            <input type="checkbox" v-model="openDropdowns[i]" />
            <div class="collapse-title font-semibold">Member {{ i + 1 }}</div>
            <div class="collapse-content text-sm space-y-2">
              <FormInput
                category="First Name"
                color="white"
                v-model="Group[i]!.firstName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
              />
              <FormInput
                category="Last Name"
                color="white"
                v-model="Group[i]!.lastName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
              />
              <FormInput
                category="NYC Students Email"
                color="white"
                v-model="Group[i]!.email"
                type="email"
                placeholder="examples@nycstudents.net"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
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
import { navigateTo } from "#app";

const groupLeader = reactive<Student>({
  firstName: "",
  lastName: "",
  email: "",
  osis: "",
});
const InGroup = ref(false);
const GroupSize = ref(1);
const Group = ref<Student[]>([groupLeader]);
const edittingForm = ref(false);
const loggedIn = ref(false);
const openDropdowns = ref<boolean[]>([]);
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
  openDropdowns.value = [];
  for (let i = 0; i < GroupSize.value; i++) {
    openDropdowns.value.push(false);
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
  console.log(dataPush);

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
      for (let i = 0; i < failedIndexes.value.length; i++) {
        const failedIndex = failedIndexes.value[i];
        if (failedIndex !== undefined) {
          if (
            failedIndex !== 0 &&
            openDropdowns.value[failedIndex] !== undefined
          ) {
            openDropdowns.value[failedIndex] = true;
          }
        }
      }

      alert(data.message);
    } else {
      alert("Submission successful!");
      await navigateTo("/");
    }
  } catch (err) {
    alert("couldnt push data to mongodb");
  }
}
</script>
