<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <NuxtLink
      @click="edittingForm = true"
      v-if="!edittingForm"
      to="/StudentEdit"
      class="absolute right-3.5 top-3.5 bg-primary rounded shadow hover:bg-black transition px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base"
    >
      <span class="md:hidden">Edit</span>
      <span class="hidden md:inline"> Want to edit a form? Click here </span>
    </NuxtLink>

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
          :isGuest="groupLeader.isGuest"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="groupLeader.lastName"
          type="text"
          placeholder="Enter here"
          :isGuest="groupLeader.isGuest"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="NYC Students Email"
          color="black"
          v-model="groupLeader.email"
          type="email"
          placeholder="examples@nycstudents.net"
          :isGuest="groupLeader.isGuest"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <FormInput
          category="OSIS"
          color="black"
          v-model="groupLeader.osis"
          type="text"
          placeholder="123456789"
          :isGuest="groupLeader.isGuest"
          :class="hasError(0) ? 'border-red-500 border-4 rounded' : ''"
        />
        <fieldset class="fieldset mb-4">
          <label
            class="label text-black text-lg font-semibold flex flex-col items-start gap-2"
          >
            <span>Are you registering for a group?</span>
            <input
              type="checkbox"
              v-model="InGroup"
              class="checkbox checkbox-primary border-2 border-black"
              @change="clearGroup()"
            />
          </label>
        </fieldset>

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
                :isGuest="Group[i]!.isGuest"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
              />
              <FormInput
                category="Last Name"
                color="white"
                v-model="Group[i]!.lastName"
                type="text"
                placeholder="Enter"
                :isGuest="Group[i]!.isGuest"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
              />
              <FormInput
                category="NYC Students Email"
                color="white"
                v-model="Group[i]!.email"
                type="email"
                placeholder="examples@nycstudents.net"
                :isGuest="Group[i]!.isGuest"
                :class="hasError(i) ? 'border-red-500 border-4 rounded' : ''"
              />
              <fieldset class="fieldset mb-4">
                <label
                  class="label text-xl font-bold flex flex-col items-start gap-2"
                >
                  <span>Are you bringing a guest?</span>
                  <input
                    type="checkbox"
                    v-model="Group[i]!.bringingGuest"
                    class="checkbox checkbox-primary border-2 border-white"
                    :disabled="Group[i]!.isGuest"
                    @click="guestChange(i)"
                  />
                </label>
              </fieldset>
              <div v-if="Group[i]!.bringingGuest === true">
                <div>
                  <label
                    class="text-xl font-bold text-center mb-6 text-white"
                    for="category"
                    >Guest First Name</label
                  >
                  <input
                    type="email"
                    v-model="Group[i + 1]!.firstName"
                    placeholder="Enter"
                    class="input input-bordered w-full mb-4"
                    required
                  />
                </div>
                <div>
                  <label
                    class="text-xl font-bold text-center mb-6 text-white"
                    for="category"
                    >Guest Last Name</label
                  >
                  <input
                    type="email"
                    v-model="Group[i + 1]!.lastName"
                    placeholder="Enter"
                    class="input input-bordered w-full mb-4"
                    required
                  />
                </div>
                <div>
                  <label
                    class="text-xl font-bold text-center mb-6 text-white"
                    for="category"
                    >Guest Email</label
                  >
                  <input
                    type="email"
                    mail
                    v-model="Group[i + 1]!.email"
                    placeholder="example@nycstudents.net"
                    class="input input-bordered w-full mb-4"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                class="btn btn-error rounded"
                @click="removeStudent(i)"
              >
                REMOVE STUDENT
              </button>
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
  bringingGuest: false,
  isGuest: false,
  guestOwner: "",
});
const InGroup = ref(false);
const GroupSize = ref(1);
const Group = ref<Student[]>([groupLeader]);
const edittingForm = ref(false);
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
    Group.value.push({
      firstName: "",
      lastName: "",
      email: "",
      bringingGuest: false,
      isGuest: false,
      guestOwner: "",
    });
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
function guestChange(index: number) {
  if (Group.value[index]!.bringingGuest === true) {
    Group.value.splice(index + 1, 1);
    GroupSize.value = GroupSize.value - 1;
    Group.value[index]!.bringingGuest = false;
    return;
  }
  //this needs to PROPERLY delete students
  // small issue fixes: styling, ensure theres no errors as it is rn, and make it so submit.prevent doesnt check the fields for the student when doing remove student
  Group.value[index]!.bringingGuest = !Group.value[index]!.bringingGuest;
  if (GroupSize.value + 1 > 12) {
    alert(
      "Cant add guest: too many students to one group. Please remove a student before adding a guest."
    );
    return;
  }
  GroupSize.value = GroupSize.value + 1;
  Group.value.splice(index + 1, 0, {
    firstName: "",
    lastName: "",
    email: "",
    bringingGuest: false,
    isGuest: true,
    guestOwner: `${Group.value[index]?.firstName} ${Group.value[index]?.lastName}`,
  });
}
function removeStudent(removeIndex: number) {
  const removeStudent = Group.value[removeIndex];
  for (let i = 0; i < GroupSize.value; i++) {
    const studentName = `${removeStudent?.firstName} ${removeStudent?.lastName}`;
    if (Group.value[i]?.guestOwner == studentName) {
      alert(
        "Can not remove student until the dependent guest is removed from the student."
      );
      return;
    }
  }
  Group.value.splice(removeIndex, 1);
  GroupSize.value = GroupSize.value - 1;
}
async function submit() {
  const membersToSubmit = InGroup.value
    ? Group.value.slice(1, GroupSize.value)
    : [];
  const dataPush = {
    leader: groupLeader,
    members: membersToSubmit,
  };

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
