<template>
  <div class="flex justify-center min-h-screen bg-gray-500 p-6">
    <div class="card w-full max-w-md bg-white shadow-xl p-6">
      <!-- leader login -->

      <div v-if="!groupLoaded">
        <h1 class="text-2xl font-bold mb-4 text-center text-black">
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
          type="text"
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
        <h1 class="text-2xl font-bold mb-4 text-center text-black">
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
            type="text"
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
          <!--button to delete ALL the students-->
          <div
            v-for="(member, i) in members"
            :key="i"
            class="border p-3 rounded relative"

          >
            <h3 class="font-semibold mb-2 text-black">Member {{ i + 1 }}</h3>

            <button
              class="absolute top-2 right-2 text-red-600 text-sm"
              @click="removeMember(i)"
            >
              Remove
            </button>

            <FormInput
              category="First Name"
              color="black"
              v-model="member.firstName"
              type="text"
              placeholder="Enter here"
              :isGuest="!member.isGuest"
              :class="hasError(i+1) ? 'border-red-500 border-4 rounded' : ''"
            />
            <FormInput
              category="Last Name"
              color="black"
              v-model="member.lastName"
              type="text"
              placeholder="Enter here"
              :isGuest="!member.isGuest"
              :class="hasError(i+1) ? 'border-red-500 border-4 rounded' : ''"
            />
            <FormInput
              category="Email"
              color="black"
              v-model="member.email"
              type="text"
              placeholder="Enter here"
              :isGuest="!member.isGuest"
              :class="hasError(i+1) ? 'border-red-500 border-4 rounded' : ''"
            />
            <fieldset class="fieldset mb-4">
              <label
                class="label text-xl font-bold flex flex-col items-start gap-2 text-black"
              >
                <span>Are you bringing a guest?</span>
                <input
                  type="checkbox"
                  v-model="member.bringingGuest"
                  class="checkbox checkbox-primary border-2 border-black"
                  :disabled="!member.isGuest"
                  @click="guestChange(i)"
                />
              </label>
            </fieldset>
            <div v-if="member.bringingGuest === true">
              <div :class="hasError(i+2) ? 'border-red-500 border-4 rounded' : ''">
                <label
                  class="text-xl font-bold text-center mb-6 text-black"
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
              <div :class="hasError(i+2) ? 'border-red-500 border-4 rounded' : ''">
                <label
                  class="text-xl font-bold text-center mb-6 text-black"
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
              <div :class="hasError(i+2) ? 'border-red-500 border-4 rounded' : ''">
                <label
                  class="text-xl font-bold text-center mb-6 text-white"
                  for="category"
                  >Guest Email</label
                >
                <input
                  type="email"
                  mail
                  v-model="members[i + 1]!.email"
                  placeholder="example@nycstudents.net"
                  class="input input-bordered w-full mb-4"
                  required
                />
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
          Remove group
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
});

const maxMembers = 11;

function addMember() {
  if (members.value.length >= maxMembers) return;

  members.value.push({
    firstName: "",
    lastName: "",
    email: "",
  });
}

function removeMember(index: number) {
  members.value.splice(index, 1);

  // clear errors tied to shifted indexes
  failedIndexes.value = failedIndexes.value
    .filter((i) => i !== index + 1)
    .map((i) => (i > index + 1 ? i - 1 : i));
}
async function removeGroup() {
  try {
    const res = await fetch("/api/removeGroup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leader }),
    });

    alert("Group deleted successfully");
    await navigateTo("/");
  } catch {
    alert("Server error while deleting group");
  }
}
const members = ref<Student[]>([]);
const groupLoaded = ref(false);
const failedIndexes = ref<number[]>([]);

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
    members.value = data.members || [];
    groupLoaded.value = true;
  } catch {
    alert("Could not find group for this leader");
  }
}
function guestChange(index: number) {
  if (members.value[index]!.bringingGuest === true) {
    members.value.splice(index + 1, 1);
    members.value[index]!.bringingGuest = false;
    return;
  }
  members.value[index]!.bringingGuest = !members.value[index]!.bringingGuest;
  if (members.value.length + 1 > 12) {
    alert(
      "Cant add guest: too many students to one group. Please remove a student before adding a guest."
    );
    return;
  }
  members.value.splice(index + 1, 0, {
    firstName: "",
    lastName: "",
    email: "",
    bringingGuest: false,
    isGuest: true,
    guestOwner: `${members.value[index]?.email}`,
  });
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
    console.log(JSON.stringify({
        leader,
        members: members.value,
      }),)
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
