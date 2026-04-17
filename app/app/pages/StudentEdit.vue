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
            <div class="collapse-title font-semibold text-black">
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
              color="black"
              v-model="member.firstName"
              type="text"
              placeholder="Enter here"
              :isGuest="member.isGuest"
            />
            <FormInput
              category="Last Name"
              color="black"
              v-model="member.lastName"
              type="text"
              placeholder="Enter here"
              :isGuest="member.isGuest"
            />
            <FormInput
              category="Email"
              color="black"
              v-model="member.email"
              type="text"
              placeholder="Enter here"
              :isGuest="member.isGuest"
            />
            <fieldset class="fieldset mb-4">
              <label
                class="label text-xl font-bold flex flex-col items-start gap-2"
              >
                <span>Are you bringing a guest?</span>
                <input
                  type="checkbox"
                  v-model="member.bringingGuest"
                  class="checkbox checkbox-primary border-2 border-white"
                  :disabled="member.isGuest"
                  @click="guestChange(i)"
                />
              </label>
            </fieldset>
            <div v-if="member.bringingGuest === true">
              <div>
                <label
                  class="text-xl font-bold text-center mb-6 text-white"
                  for="category"
                  >Guest First Name</label
                >
                <input
                  type="email"
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
                  type="email"
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
const openDropdowns = ref<boolean[]>([]);

function normalizeStudent(student: Partial<Student>): Student {
  const legacyStudent = student as Partial<Student> & { guest?: boolean };
  return {
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    email: student.email || "",
    osis: student.osis,
    bringingGuest: student.bringingGuest || false,
    isGuest: student.isGuest || legacyStudent.guest || false,
    guestOwner: student.guestOwner || "",
  };
}

function normalizeMembers(rawMembers: Partial<Student>[]): Student[] {
  const normalized = rawMembers.map((member) => normalizeStudent(member));
  const owners = normalized.filter((member) => !member.isGuest);
  const guests = normalized.filter((member) => member.isGuest);

  const guestsByOwner = new Map<string, Student>();
  for (const guest of guests) {
    const ownerKey = (guest.guestOwner || "").trim().toLowerCase();
    if (ownerKey && !guestsByOwner.has(ownerKey)) {
      guestsByOwner.set(ownerKey, guest);
    }
  }

  const rebuiltMembers: Student[] = [];
  for (const owner of owners) {
    owner.bringingGuest = false;
    rebuiltMembers.push(owner);

    const ownerKey = owner.email.trim().toLowerCase();
    const dependentGuest = guestsByOwner.get(ownerKey);
    if (dependentGuest) {
      dependentGuest.isGuest = true;
      dependentGuest.bringingGuest = false;
      dependentGuest.guestOwner = owner.email;
      owner.bringingGuest = true;
      rebuiltMembers.push(dependentGuest);
      guestsByOwner.delete(ownerKey);
    }
  }

  return rebuiltMembers;
}

function buildMembersForSubmit(): Student[] {
  const normalized = normalizeMembers(members.value);

  for (let i = 0; i < normalized.length; i++) {
    const current = normalized[i];
    if (!current) continue;

    if (current.isGuest) {
      current.bringingGuest = false;
      continue;
    }

    const next = normalized[i + 1];
    current.bringingGuest = Boolean(next?.isGuest);

    if (next?.isGuest) {
      next.guestOwner = current.email;
    }
  }

  return normalized;
}

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
    Object.assign(leader, normalizeStudent(data.leader || {}));
    members.value = normalizeMembers(data.members || []);
    openDropdowns.value = members.value.map(() => false);
    groupLoaded.value = true;
  } catch {
    alert("Could not find group for this leader");
  }
}
function guestChange(index: number) {
  const member = members.value[index];
  if (!member || member.isGuest) return;

  const nextMember = members.value[index + 1];

  if (member.bringingGuest && nextMember?.isGuest) {
    members.value.splice(index + 1, 1);
    openDropdowns.value.splice(index + 1, 1);
    member.bringingGuest = false;
    return;
  }

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
  const normalizedMembers = buildMembersForSubmit();
  console.log("Submitting edits", { leader, members: normalizedMembers });
  try {
    const res = await fetch("/api/editGroup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leader,
        members: normalizedMembers,
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
