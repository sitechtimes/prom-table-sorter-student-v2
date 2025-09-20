<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Student Form
      </h1>

      <form @submit.prevent="submit">
        <h2 class="text-black text-lg font-semibold">First Name:</h2>
        <input
          type="text"
          v-model="GLFirstName"
          placeholder="Enter here"
          class="input input-bordered w-full mb-4"
          required
        />

        <h2 class="text-black text-lg font-semibold">Last Name:</h2>
        <input
          type="text"
          v-model="GLLastName"
          placeholder="Enter here"
          class="input input-bordered w-full mb-4"
          required
        />

        <h2 class="text-black text-lg font-semibold">NYC Students Email:</h2>
        <input
          type="email"
          v-model="GLEmail"
          placeholder="examples@nycstudents.net"
          class="input input-bordered w-full mb-4"
          required
        />

        <h2 class="text-black text-lg font-semibold">
          OSIS Number (used as verification)
        </h2>
        <input
          type="text"
          v-model="GLOsis"
          placeholder="123456789"
          class="input input-bordered w-full mb-4"
          required
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
              <span v-for="i in 11" :key="i">|</span>
            </div>
          </div>
          <h3 class="text-black font-semibold text-center mt-4">
            Group Size: {{ GroupSize }}
          </h3>
        </div>

        <div v-if="InGroup" class="mt-6 space-y-3">
          <div
            v-for="i in GroupSize - 1"
            :key="`member-${i}`"
            class="collapse collapse-arrow bg-base-100 border border-base-300 space-y-2"
          >
            <input type="radio" :name="'group-accordion'" :checked="i === 1" />
            <div class="collapse-title font-semibold">Member {{ i + 1 }}</div>

            <div class="collapse-content text-sm space-y-2">
              <h2 class="text-white text-lg font-semibold">First Name:</h2>
              <input
                type="text"
                placeholder="Enter"
                class="input input-bordered w-full"
                v-model="Group[i].firstName"
                required
              />
              <h2 class="text-white text-lg font-semibold">Last Name:</h2>
              <input
                type="text"
                placeholder="Enter"
                class="input input-bordered w-full"
                v-model="Group[i].lastName"
                required
              />
              <h2 class="text-white text-lg font-semibold">
                NYC Students Email:
              </h2>
              <input
                type="email"
                placeholder="examples@nycstudents.net"
                class="input input-bordered w-full"
                v-model="Group[i].email"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-secondary w-full mt-6"
          @click="submit()"
        >
          Submit Form
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, onMounted } from 'vue'
const GLFirstName = ref('')
const GLLastName = ref('')
const GLEmail = ref('')
const GLOsis = ref('')
const InGroup = ref(false)
const GroupSize = ref(1)
const Group = ref([])

function dataCheck() {
  //when excel is here check if input is in the data
  //should also check if student is already in a group thats been submitted
}
function organizeGroup() {
  const groupLeader = {
    firstName: GLFirstName.value,
    lastName: GLLastName.value,
    email: GLEmail.value,
    osis: GLOsis.value,
  }
  for (let i = Group.value.length; i < GroupSize.value; i++) {
    Group.value.push({ firstName: '', lastName: '', email: '' })
  }
  Group.value = Group.value.slice(0, GroupSize.value)
  if (!InGroup.value) {
    Group.value.splice(0,Group.value.length)
  }

  Group.value[0] = groupLeader
}
function clearGroup() {
  const groupLeader = {
    firstName: GLFirstName.value,
    lastName: GLLastName.value,
    email: GLEmail.value,
    osis: GLOsis.value,
  }

  if (InGroup.value) {
    GroupSize.value = 2
    organizeGroup()
  } else {
    GroupSize.value = 1
    Group.value = [groupLeader]
  }
}
function submit() {
  console.log('Group:', Group.value)
  //push stuff to mongodb
}
function createVerificationCode() {
  //will generate code for table leaders that want to make an edit to their group and show it to them
}
definePageMeta({
  middleware: 'auth'
})
</script>
