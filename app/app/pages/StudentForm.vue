<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Student Form
      </h1>
      <h2 class="text-black text-lg font-semibold">First Name:</h2>
      <input
        type="text"
        v-model="FirstName"
        placeholder="Enter here"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">Last Name:</h2>
      <input
        type="text"
        v-model="LastName"
        placeholder="Enter here"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">NYC Students Email:</h2>
      <input
        type="text"
        v-model="Email"
        placeholder="examples@nycstudents.net"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">
        Are you registering for group?
      </h2>
      <input
        type="checkbox"
        v-model="InGroup"
        class="checkbox checkbox-primary mb-4"
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
            v-model="GroupSize"
          />
          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
        </div>
        <h3 class="text-black font-semibold text-center mt-4">
          Group Size: {{ GroupSize }}
        </h3>
      </div>
      <h2
        class="text-black text-center mt-0"
        v-for="student in students"
        :key="student.name"
      >
        Smth for listing all ppl in the group's info using v-for
      </h2>
      <button class="btn btn-primary w-full" @click="submit()">
        Submit Form
      </button>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, onMounted } from 'vue'

const FirstName = ref('')
const LastName = ref('')
const Email = ref('')
const InGroup = ref(false)
const GroupSize = ref(2)
const Group = ref([])

function dataCheck() {
  //when excel is here check if input is in the data
}
function organizeGroup() {
  const GroupLeader=[FirstName.value, LastName.value, Email.value]
  //should also check if student is already in a group thats been submitted
}
function submit() {
  console.log(Name.value, Email.value, InGroup.value, GroupSize.value)
}
function createVerificationCode() {
  //will generate code for table leaders that want to make an edit to their group and show it to them
}
definePageMeta({
  middleware: 'auth'
})
</script>
