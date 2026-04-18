<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500 p-6">
    <NuxtLink
      to="/StudentForm"
      class="absolute right-3.5 top-3.5 bg-primary rounded shadow hover:bg-black transition px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base"
    >
      <span class="md:hidden">Back</span>
      <span class="hidden md:inline">Back to Student Form</span>
    </NuxtLink>

    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <!-- leader login -->

      <div v-if="!groupLoaded">
        <h1 class="text-3xl font-bold mb-4 text-center text-black">
          Find Your Group
        </h1>

        <FormInput
          category="First Name"
          color="black"
          v-model="leader.firstName"
          type="text"
          placeholder="Enter here"
          :isGuest="leader.isGuest"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="leader.lastName"
          type="text"
          placeholder="Enter here"
          :isGuest="leader.isGuest"
        />
        <FormInput
          category="Students Email"
          color="black"
          v-model="leader.email"
          type="email"
          placeholder="Enter here"
          :isGuest="leader.isGuest"
        />
        <FormInput
          category="Osis"
          color="black"
          v-model="leader.osis"
          type="text"
          placeholder="Enter here"
          :isGuest="leader.isGuest"
        />

        <button class="btn btn-primary w-full mt-4" @click="fetchGroup">
          Find My Group
        </button>
      </div>

      <!-- populate the groups / actual editing forms-->
      <div v-else>
        <h1 class="text-3xl font-bold mb-4 text-center text-black">
          Edit Your Group
        </h1>

        <div class="opacity-60 pointer-events-none">
          <FormInput
            category="Leader First Name"
            color="black"
            v-model="leader.firstName"
            type="text"
            placeholder="Enter Here"
            :isGuest="leader.isGuest"
          />
          <FormInput
            category="Leader Last Name"
            color="black"
            v-model="leader.lastName"
            type="text"
            placeholder="Enter Here"
            :isGuest="leader.isGuest"
          />
          <FormInput
            category="Leader Email"
            color="black"
            v-model="leader.email"
            type="email"
            placeholder="Enter Here"
            :isGuest="leader.isGuest"
          />
          <FormInput
            category="Leader OSIS"
            color="black"
            v-model="leader.osis"
            type="text"
            placeholder="Enter Here"
            :isGuest="leader.isGuest"
          />
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="(member, i) in members"
            :key="i"
            class="collapse collapse-arrow bg-base-100 border border-base-300 space-y-2"
            :class="hasError(i + 1) ? 'border-red-500 border-2' : ''"
          >
            <input type="checkbox" v-model="openDropdowns[i]" />
            <div class="collapse-title font-semibold">
              <span v-if="member.isGuest">Guest {{ i + 1 }}</span>
              <span v-else>Member {{ i + 1 }}</span>
            </div>

            <div class="collapse-content text-sm space-y-2 relative">
              <button
                type="button"
                class="absolute top-0 right-0 btn btn-error btn-xs"
                @click="removeMember(i)"
              >
                Remove
              </button>

              <FormInput
                category="First Name"
                color="white"
                v-model="member.firstName"
                type="text"
                placeholder="Enter"
                :isGuest="member.isGuest"
              />
              <FormInput
                category="Last Name"
                color="white"
                v-model="member.lastName"
                type="text"
                placeholder="Enter"
                :isGuest="member.isGuest"
              />
              <FormInput
                category="Email"
                color="white"
                v-model="member.email"
                type="email"
                :placeholder="
                  member.isGuest
                    ? 'example@gmail.com'
                    : 'example@nycstudents.net'
                "
                :isGuest="member.isGuest"
              />

              <fieldset v-if="!member.isGuest" class="fieldset mb-4">
                <label
                  class="label text-xl font-bold flex flex-col items-start gap-2"
                >
                  <span>Are you bringing a guest?</span>
                  <input
                    type="checkbox"
                    :checked="member.bringingGuest"
                    class="checkbox checkbox-primary border-2 border-white"
                    @change="guestChange(i)"
                  />
                </label>
              </fieldset>

              <!-- Guest input fields: only shown if this member has a guest row directly after them.
                   guestChange() inserts the guest row at index+1, so we edit it directly here. -->
              <div
                v-if="
                  !member.isGuest &&
                  member.bringingGuest &&
                  members[i + 1]?.isGuest
                "
              >
                <div>
                  <label
                    class="text-xl font-bold text-center mb-6 text-white"
                    for="category"
                    >Guest First Name</label
                  >
                  <input
                    type="text"
                    v-model="members[i + 1]!.firstName"
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
                    type="text"
                    v-model="members[i + 1]!.lastName"
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
                    v-model="members[i + 1]!.email"
                    placeholder="example@gmail.com"
                    class="input input-bordered w-full mb-4"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          class="btn btn-outline w-full mt-4 text-black hover:text-white"
          @click="addMember"
          :disabled="members.length >= maxMembers"
        >
          Add Member
        </button>

        <button class="btn btn-primary w-full mt-6" @click="submitEdits">
          Submit Changes
        </button>
        <button class="btn btn-error w-full mt-6" @click="removeGroup">
          Delete Group
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { navigateTo } from "#app";

const leader = reactive<Student>({
  firstName: "",
  lastName: "",
  email: "",
  osis: "",
  bringingGuest: false,
  isGuest: false,
  guestOwner: "",
});

const maxMembers = 11;

function addMember() {
  if (members.value.length >= maxMembers) return;

  members.value.push({
    firstName: "",
    lastName: "",
    email: "",
    bringingGuest: false,
    isGuest: false,
    guestOwner: "",
  });

  openDropdowns.value.push(true);
}

function removeMember(index: number) {
  const member = members.value[index];
  if (!member) return;

  const nextMember = members.value[index + 1];

  if (!member.isGuest && member.bringingGuest && nextMember?.isGuest) {
    alert(
      "Can not remove student until the dependent guest is removed from the student.",
    );
    return;
  }

  if (member.isGuest && index > 0) {
    const owner = members.value[index - 1];
    if (owner && !owner.isGuest) {
      owner.bringingGuest = false;
    }
  }

  members.value.splice(index, 1);
  openDropdowns.value.splice(index, 1);

  // clear errors tied to shifted indexes
  failedIndexes.value = failedIndexes.value
    .filter((i) => i !== index + 1)
    .map((i) => (i > index + 1 ? i - 1 : i));
}
async function removeGroup() {
  try {
    const res = await fetch("/api/removeGroup", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leader }),
    });

    alert("Group deleted successfully");
    await navigateTo("/");
  } catch {
    alert("Server error while updating group");
  }
}
const members = ref<Student[]>([]);
const groupLoaded = ref(false);
const failedIndexes = ref<number[]>([]);
const openDropdowns = ref<boolean[]>([]);



function hasError(index: number) {
  return failedIndexes.value.includes(index);
}

async function fetchGroup() {
  try {
    const res = await fetch("/api/grabGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leader }),
    });
    if (!res.ok) throw new Error("Group not found");
    const data = await res.json();
    Object.assign(leader, {
      firstName: data.leader?.firstName || "",
      lastName: data.leader?.lastName || "",
      email: data.leader?.email || "",
      osis: data.leader?.osis,
      bringingGuest: false,
      isGuest: false,
      guestOwner: "",
    });
    members.value = data.members;
    openDropdowns.value = members.value.map(() => false);
    groupLoaded.value = true;
  } catch {
    alert("Could not find group for this leader");
  }
}
/*
 Toggles guest status for a member.
 If toggling ON: inserts a new guest row directly after the member. Guest input fields
 appear below in the collapse section when this is true.
 If toggling OFF: removes the existing guest row if present.
 */
function guestChange(index: number) {
  const member = members.value[index];
  if (!member || member.isGuest) return;

  const nextMember = members.value[index + 1];

  // Toggle OFF: remove the existing guest row
  if (member.bringingGuest && nextMember?.isGuest) {
    members.value.splice(index + 1, 1);
    openDropdowns.value.splice(index + 1, 1);
    member.bringingGuest = false;
    return;
  }

  // Toggle ON: insert a new guest row (with size check)
  if (members.value.length + 1 > 12) {
    alert(
      "Cant add guest: too many students to one group. Please remove a student before adding a guest.",
    );
    return;
  }

  member.bringingGuest = true;
  members.value.splice(index + 1, 0, {
    firstName: "",
    lastName: "",
    email: "",
    bringingGuest: false,
    isGuest: true,
    guestOwner: member.email || "",
  });
  openDropdowns.value.splice(index + 1, 0, true);
}
async function submitEdits() {
  failedIndexes.value = [];
  try {
    const res = await fetch("/api/editGroup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leader,
        members: members.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      failedIndexes.value = data.data.failedIndexes || [];
      alert(data.message);
      return;
    }

    alert("Group updated successfully");
    await navigateTo("/");
  } catch {
    alert("Server error while updating group");
  }
}
</script>
