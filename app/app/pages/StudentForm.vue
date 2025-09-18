<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default"
    >
      <h1 class="text-black text-2xl font-bold text-center mb-6">
        Student Form
      </h1>
      <h2 class="text-black text-lg font-semibold">Name:</h2>
      <input
        type="text"
        v-model="name"
        placeholder="Enter here"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">Email:</h2>
      <input
        type="text"
        v-model="email"
        placeholder="Enter here"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">Osis:</h2>
      <input
        type="number"
        v-model="osis"
        placeholder="Enter here"
        class="input input-bordered w-full mb-4"
      />
      <h2 class="text-black text-lg font-semibold">
        Are you registering for group?
      </h2>
      <input
        type="checkbox"
        v-model="forGroup"
        class="checkbox checkbox-primary mb-4"
      />
      <div v-if="forGroup" class="mb-6">
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
            v-model="groupSize"
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
          Group Size: {{ groupSize }}
        </h3>
      </div>
      <h2 class="text-black text-center mt-0">
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

const name = ref('')
const email = ref('')
const osis = ref('')
const forGroup = ref(false)
const groupSize = ref(2)

function submit() {
  console.log("this would submit the data to the database")
}

definePageMeta({
  middleware: 'auth'
})
</script>
